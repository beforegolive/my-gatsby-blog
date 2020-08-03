--- 
title: '如何搭建类似麦当劳店中需登录认证的wifi' 
date: '2020-07-24'
cover: './cover.png'
--- 

日常生活中常能碰到一些商场或餐饮店提供一种需认证的wifi，这种wifi连接后不能立刻使用，往往还需要在一个页面上进一步认证操作才行，比如输入手机号填个验证码之类的。

作为一名前端开发，每当我去麦当劳店里吃饭，用手机连接wifi时，一直都很想搞清楚几个问题：
- 这种wifi认证页面是如何搭建的？
- 它的认证机制是怎样的？
- 它跟正常的网站会有哪些不一样？

我工作地旁边的麦当劳wifi认证截图：

![](https://user-gold-cdn.xitu.io/2020/7/24/1737ef087d8c450d?w=1080&h=2340&f=jpeg&s=72244)

![](https://user-gold-cdn.xitu.io/2020/7/24/1737ef0ad36721bf?w=1080&h=2340&f=jpeg&s=69542)


这种wifi的英文学名叫**Captive Portal**，在开源社区中早已存在一些组件可轻松搭建这种类型的wifi，比如wifiDog, CoovaChilli, nodogslash等。

为了一探究竟，我用nodogslash在树莓派上搭建了一个带认证功能的wifi，并且使用React创建了自定义认证页面，尝试搞清楚整个认证流程背后的原理。

最终认证页面效果如下，点击按钮即完成认证：

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e5b0e88a8be8?w=1240&h=1106&f=png&s=353081)

### wifi认证的机制和原理

每当设备连接wifi后，系统会自动做一个连通性校验，此校验的本质是发送一个HTTP请求。如果请求失败，则会触发相应机制要求用户输入登录凭证。如果请求成功，则表示网络已通，无任何回应，这个网络校验过程叫Captive Portal Detection (CPD)。

不同的操作系统校验时的请求地址不一样，比如我用手边的android和iphone手机分别做了测试，他们对应校验地址如下：

- http://connectivitycheck.smartisan.com/wifi.html （坚果 pro3）
- http://captive.apple.com/hotspot-detect.html （iphone 6）

简单来说，wifi的认证过程通过一个HTTP GET请求即可完成。以我本文示例中使用的`nodogsplash`组件为例，其内部用C语言实现了一个服务器运行在2050端口。设备连上wifi时，wifi端会生成一个token，当设备被重定向到认证页面时，页面模板中包含此token，此时用户只需发送一个GET请求将此token传入到对应服务器的认证地址即可。

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e6d58639002a?w=1636&h=602&f=png&s=71017)

如果你配置了FAS，也就是说设置了自定义认证机制，比如说你想添加了一个手机验证环节，需要用户填入手机和验证码才能完成认证。那么`nodogsplash`在重定向登录页面的时候会把一些重要参数附带在请求地址的后面，让你的自定义入口页能获取到这些认证凭证，比如token之类的参数。

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e8f0ce691329?w=706&h=1462&f=png&s=310187)

等你的自定义验证手机验证通过了，再选择将token以HTTP GET请求发送回原2050端口上的认证服务器，整个流程如下图所示：

![](https://user-gold-cdn.xitu.io/2020/7/24/1737e828bab6f58b?w=1762&h=1068&f=png&s=116808)

#### 认证站点的限制
需要注意的是，当用户设备连上wifi但还尚未通过验证时，网络访问是受限的，此时能访问的内容取决于防火墙的设置。比如我上面示例中，将站点配置在路由器上，网站端口是8080，依赖的后端服务器运行在端口8081上，此时必须在`nodogsplash`的防火墙规则中开放这两个端口，才能让未认证的用户设备访问的到。假如服务器配置在外网，就要将对应的域名或IP在防火墙中开放出来，具体配置方式参考`nodogsplash`关于[FAS的文档](https://nodogsplash.readthedocs.io/en/v4.5.1/fas.html)。

另外，wifi认证页面的实现上要有一些额外的安全考量。比如在`nodogsplash`的官网文档中建议网站遵循一下安全准则：
 1. 当认证成功后需立刻关闭浏览器
 2. 禁止使用链接
 3. 禁止文件下载功能
 4. 禁止执行javascript

关于第二条，可以使用表单提交的方式替换链接调整，而对于第四条，它的本意并不是禁止js功能，只是为了防止执行js语句引起的安全性问题。我在示例中搭建的网站使用了react框架，在android和ios上都能正常显示。

因此，在功能实现上相比较通常的前端站点，自定义的wifi认证网站部分功能受限，但影响并不大，可以使用你自己擅长的前端框架来搭建。

### 创建需认证的wifi

> **注意，如果你手边没有树莓派或Linux系统，或者对配置部分不感兴趣，直接跳过即可。**

#### 准备工作
- 树莓派 4B
- hostapd和dnsmasq (用于创建wifi热点)
- nodogsplash (核心组件，管理wifi热点，提供认证功能)

nodogsplash可以安装OpenWrt和Linux中，前者是开源的智能路由器操作系统，国内的一些路由器厂商通常是基于此系统定制的，后者就不必多介绍了，这次的示例就是安装在Linux系统上，为了方便安装调试，我直接使用一个树莓派4作为载体，用网线连通网络，用无线创建热点wifi。

#### 创建wifi热点

在安装组件之前，首先将依赖包更新，然后安装`hostapd`和`dnsmasq`两个组件，前者用来创建wifi热点，后者用来处理DNS和DHCP等服务。

```
sudo apt-get update
sudo apt-get upgrade

sudo apt-get install hostapd dnsmasq
```



修改配置并指定一个wifi网段，配置文件在`/etc/dhcpcd.conf`

```
sudo vi /etc/dhcpcd.conf

# ...

# 文件内容如下：
interface wlan0
    static ip_address=192.168.220.1/24
    nohook wpa_supplicant
```

其中wlan0是无线网卡的名称，可以通过`ifconfig`命令查询，IP地址可任意指定，只要不跟家中的wifi冲突即可，比如说此处设置的是192.168.220.\*，而我家中的wifi网段是192.168.31.\*。

重启一下服务，让配置生效：

```
sudo systemctl restart dhcpcd
```

修改hostapd配置，用于设置wifi的名称和密码，其中ssid表示此wifi的名称，wpa_passphrase表示此wifi的密码。

```
sudo vi /etc/hostapd/hostapd.conf

# ...

# 文件内容如下：
interface=wlan0
driver=nl80211

hw_mode=g
channel=6
ieee80211n=1
wmm_enabled=0
macaddr_acl=0
ignore_broadcast_ssid=0

auth_algs=1
wpa=2
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP

# wif的名称
ssid=Pi4-AP
# wifi的秘密
wpa_passphrase=pimylifeup
```



##### 修改配置文件`/etc/default/hostapd`

这时还需要再修改两个配置文件，一个是`hostapd`启动时的加载文件，需要将配置文件字段`DAEMON_CONF`指定为上面的文件地址，默认情况下该字段是被注释掉的。

```
sudo nano /etc/default/hostapd

# ...
# 文件内容如下：
# 将#DAEMON_CONF="" 修改为下面这行
DAEMON_CONF="/etc/hostapd/hostapd.conf"
```



##### 修改配置文件`/etc/init.d/hostapd`

另一个配置文件是系统服务配置，同意将上文的配置文件地址赋值给`DAEMON_CONF`字段。

```
sudo vi /etc/init.d/hostapd

# ...

# 文件内容如下：
# 将DAEMON_CONF=修改为下面这行
DAEMON_CONF=/etc/hostapd/hostapd.conf
```



##### 修改配置文件`/etc/dnsmasq.conf`

在此文件配置自定义wifi的网段、dns服务器等信息。

```
sudo vi /etc/dnsmasq.conf

# ...

# 文件内容如下：
interface=wlan0       # 指定无线网卡名称 
server=114.114.114.114       # 使用dns服务器
dhcp-range=192.168.220.50,192.168.220.150,12h  # 指定可用IP的网段范围和释放时间
```



#####  无线网卡转发有线网卡

修改系统配置文件中的`net.ipv4.ip_forward`字段，激活转发功能，默认情况下，该字段是被注释掉的。

```
sudo vi /etc/sysctl.conf

# ...

# 文件内容如下：
# 将原#net.ipv4.ip_forward=1的注释符号去掉，修改为下面这行
net.ipv4.ip_forward=1
```

重启系统，让此修改生效。

```
sudo reboot
```

然后，通过`iptables`命令实现网卡之间的信息转发，其中`eth0`是有线网卡的名称，可通过`ifconfig`命令查询。

```
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

最后，需要将当前`iptables`的配置保存下来，保证每次机器重启时该配置都能生效，先将配置保存到文件中`/etc/iptables.ipv4.nat`。

```
# 将配置写入/etc/iptables.ipv4.nat文件
sudo sh -c "iptables-save > /etc/iptables.ipv4.nat"
```

修改`rc.local`，保证每次启动时都会读取`iptables`配置。

```
sudo vi /etc/rc.local

# ...
# 文件内容如下：

# ...
# 在“exit 0”这一行之前添加下面命令读取iptables的配置
iptables-restore < /etc/iptables.ipv4.nat

exit 0
```



##### 启动wifi热点

最后，关于热点的配置终于配置完毕，运行一下命令启动服务：

```
sudo systemctl unmask hostapd
sudo systemctl enable hostapd
sudo systemctl start hostapd
sudo service dnsmasq start
```

这时，应该可以用手机检测到配置的wifi出现了`Pi4-AP`，该名称即上面配置的wifi名称，输入对应密码即可连上网络。此时可重启一下再连，确保重启后配置依然生效。

```
sudo reboot
```



#### 安装nodogsplash

首先安装对应依赖`git`和`libmicrohttpd-dev`。

```
sudo apt install git libmicrohttpd-dev
```

然后使用git直接将nodogsplash源码拿下来，直接安装。

```
git clone https://github.com/nodogsplash/nodogsplash.git
cd ./nodogsplash
make
sudo make install
```


#### 添加nodogsplash配置

添加配置到文件`/etc/nodogsplash/nodogsplash.conf`中，指定对应网卡、网关、最大连接用户数和认证过期时间。其中，`wlan0`是上面配置的无线网卡名，IP地址是上面配置的wifi热点的网关。

```
sudo vi /etc/nodogsplash/nodogsplash.conf

# ...

# 文件内容如下：
GatewayInterface wlan0
GatewayAddress 192.168.220.1
MaxClients 250
AuthIdleTimeout 480
```

配置完成后，启动nodogsplash。

```
sudo nodogsplash
```

此时，用手机连接创建的wifi并输入密码以后，即可看到以下弹窗，要求登录认证。


![](https://user-gold-cdn.xitu.io/2020/7/24/1737eecb43cc96b4?w=1080&h=2340&f=jpeg&s=59299)

点击登录后进入认证页面。

![](https://user-gold-cdn.xitu.io/2020/7/24/1737eed8d34ef200?w=1080&h=2340&f=jpeg&s=86961)


### [配置自定义wifi认证页面](#section-2)

`nodogsplash`本身提供了自定义验证机制 - [Forwarding Authentication Service (FAS)](https://nodogsplash.readthedocs.io/en/v4.5.1/fas.html)，它可以指定自定义的认证页面和认证方式，通过简单配置对应服务器的IP和端口即可。

比如，我在同一台机器上开启一个react站点，端口为8080，若想把此站点设置为认证入口页，只需在配置文件中添加下面四行代码即可，其中`fas_secure_enabled`有[从0到3的多个等级值](https://nodogsplash.readthedocs.io/en/v4.5.1/fas.html#example-fas-query-strings)，从低到高会让安全性和复杂性递增，此处选了最简单等级用于做演示。

```
sudo vi /etc/nodogsplash/nodogsplash.conf

# ...

# 要添加的内容如下
fasport 8080
fasremoteip 192.168.220.1
faspath /
fas_secure_enabled 0
```

最后，呈现的样子如下，点击按钮即完成认证，顺利联网。


![](https://user-gold-cdn.xitu.io/2020/7/24/1737e5b0e88a8be8?w=1240&h=1106&f=png&s=353081)

#### 备注：关于nodogsplash的版本
> nodogsplash源码中的master分支指向的3.3.5版本，而此时最新版是5.0.0（笔者写此文章时间2020.7），越新的版本其文档越完善，但要注意的是4.5.1版本是一个分水岭，因为从4.5.1之后该项目的自定义登录授权功能被剥离到一个独立项目[openNDS](https://github.com/openNDS/openNDS)。

> 假如切换到v4.5.1版后碰到`libmicrohttpd`报[组件过时异常](https://raspberrypi.stackexchange.com/questions/108803/issue-with-nodogsplash-saying-it-needed-updateed-libmicrohttpd-dev-but-i-seems)，可在配置文件中添加字段`se_outdated_mhd 1`避开此异常。

### 结语

带认证的wifi在商业活动中越来越常见，开源社区中，`nodogsplash`是其中一种实现方式，在少量限制的情况下，提供了足够的灵活性让你用熟悉的方式像搭建其他网站一样搭建wifi认证页面。最终，把你的前端能力延伸到路由器上。

#### 参考文献
> [nodogsplash的github地址](https://github.com/nodogsplash/nodogsplash)

> [nodogsplash的官方文档](https://nodogsplashdocs.readthedocs.io/en/stable/)

> [captive-portal和rfc-7710文献关联](https://blogs.arubanetworks.com/industries/rfc-7710-captive-portal-identification-using-dhcp-or-router-advertisements-ras/)

> [Captive-Portal的wiki](https://wiki.mozilla.org/QA/Captive_Portals)

> [树莓派搭建wifi热点](https://pimylifeup.com/raspberry-pi-wireless-access-point/)

> [树莓派搭建captive-portal](https://pimylifeup.com/raspberry-pi-captive-portal/)
