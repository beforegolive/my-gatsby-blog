--- 
title: '大前端项目代码重用，也许lerna是最好的选择' 
date: '2020-07-10'
cover: './cover.jpeg'
--- 

我前段时间参与了一个`react`为主的大前端项目，覆盖Web、Android、Ios三个平台。由于整个业务逻辑侧重在手机端，且Web端也是到了项目中期才开始启动，我分别以`react-native`和`react`分开建了两个项目。

可是，后端微服务集群是同一个，两个项目调用的API大多一样，导致两个项目中不可避免的出现了一些重复逻辑。比如说写在redux中的业务逻辑代码，写在http拦截器中的请求处理代码等等，这些重复的部分从目录名和文件名即可肉眼看出。

![](https://user-gold-cdn.xitu.io/2020/7/13/173452607adea86e?w=1584&h=1050&f=png&s=270873)


![](https://user-gold-cdn.xitu.io/2020/7/13/17345627a10f22a2?w=1864&h=1128&f=png&s=352870)

我尝试了将重复部分封装成独立的`npm`包供两个项目引用，但这个做法仅适用于变化频率较小的工具类代码，一旦封装了变化频繁的业务逻辑代码，用起来也麻烦不断。首先，抽出到项目之外但不易开发和调试，其次，在项目开发过程中业务代码更新太频繁，常常要不断升级版本。权衡利弊，最终得不偿失。

那么，有没有办法更好的重用这部分代码逻辑呢？有没有办法把这两个项目的通用代码抽取成独立项目，但是又能避开封装成独立`npm`包的弊端呢？

我最近尝试引入[lerna框架](https://github.com/lerna/lerna)，把这个大前端项目架构作为参照物来改造，惊喜的发现它不但能解决当时项目的痛点，还能额外带来一些多项目管理相关的好处。

事实上，开源社区早已有很多项目使用了这种多项目合而为一的方案，且采用了lerna框架的代码库也大多耳熟能详，比如国外的有[babel](https://github.com/babel/babel)、[create-react-app](https://github.com/facebook/create-react-app)、[react-router](https://github.com/ReactTraining/react-router)、[jest](https://github.com/facebook/jest)、以及国内跨端小程序框架[Taro](https://github.com/NervJS/taro)。

最后经过改造，两个项目合并成一个，重复的代码逻辑也被抽取成另一个独立项目，整个项目结构变成了下面图示这样。


![](https://user-gold-cdn.xitu.io/2020/7/13/17345266371693e2?w=1666&h=1130&f=png&s=246949)

### 引入lerna
`lerna`的名字来源于希腊神话中的九头蛇海德拉（Lernaean Hydra），拿它形容多项目工程是再贴切不过了。

`lerna`的引入比想象中简单，其实，与其说引入`lerna`，倒不如说是导入到`lerna`更合适，因为具体的做法是通过命令行创建了一个新的`lerna`项目，然后把所有项目导入进去。而且在导入的同时，每个项目的git提交记录也都合并在了一起。

```
lerna init
lerna import 你本地的项目路径
```

每个被导入的项目都会被存放在根路径的packages目录下，下面是我demo项目的截图，一共引入了三个子项目：rntest, web-app, shared。分别代表mobile，web和可重用的逻辑代码。

![](https://user-gold-cdn.xitu.io/2020/7/10/17336c236f9a7a04?w=726&h=850&f=png&s=97041)

### 使用lerna来管理项目依赖
引入`lerna`后，第一件事就是要处理安装依赖的问题，我们需要用`lerna add` 命令来代替我们习惯的`npm`或`yarn`，比如说给rntest项目安装`lodash`，就要执行下面的命令。
```
lerna add lodash --scope=rntest
```

不过，执行后你会发现其他项目中package-lock.json都发生了变化，让人非常困惑，这背后的原因是跟添加依赖后自动执行的安装命令`lerna bootstrap`有关。

![](https://user-gold-cdn.xitu.io/2020/7/10/17336ce90943c4c5?w=1590&h=692&f=png&s=306642)

#### lerna的依赖提升
`lerna`可以通过`lerna bootstrap`一行命令安装所有子项目的依赖包，而且在安装依赖时还有依赖提升功能，所谓“依赖提升”，就是把所有项目npm依赖文件都提升到根目录下，这样能避免相同依赖包在不同项目安装多次。比如多个项目都用了`redux`，通过依赖提升，多个项目一共只需要下载一次即可。不过，需要额外的参数`--hoist`让依赖提升生效。
```
lerna bootstrap --hoist
```

但是自动执行`lerna bootstrap`命令是不带依赖提升参数的，这就导致上面每个项目的lock文件都会被修改的原因。

当然，要解决这个问题也容易，可以通过`lerna`的配置来避免npm对lock文件的修改即可，写法如下：

![](https://user-gold-cdn.xitu.io/2020/7/10/17336dd6146615f4?w=574&h=610&f=png&s=45981)

#### yarn是lerna的最佳搭档
`lerna`默认使用`npm`作为安装依赖包工具，但也可以选择其他工具。`yarn`在1.0版本之后提供了workspaces的功能，该功能从更底层的地方提供了依赖提升，做的事情跟`lerna`如出一辙。把它跟`lerna`放在一起看，简直就像是为`lerna`量身定做一样。因此，推荐在lerna中搭配yarn一起使用。

把npm替换成yarn只需在lerna的配置文件添加两行代码即可，配置完以后立刻顺畅百倍。

![](https://user-gold-cdn.xitu.io/2020/7/10/17336e46c6eed674?w=538&h=386&f=png&s=35002)

### 高效的代码重用
在我参与的这个大前端项目里，多端之间代码重复的部分包含`redux`中的业务逻辑、http请求的处理、代码规范工具的检查、`git`钩子中的自定义脚本等等。在`lerna`架构下，前两者可直接抽取到一个独立的项目，然后被其他项目引用，比如在我的demo中，可以像其他依赖包一样直接引入`shared`项目, lerna会自动识别并把它导向内部项目。

```javascript
import shared from 'shared'
```

这跟直接封装成`npm`包的一大区别就是实时更新，修改立刻可见，就像在同一个项目一样，不影响开发和调试。

#### git钩子和自定义脚本的重用

我尝试把处理`git`钩子的工具`husky`安装到了根目录，触发的事件和自定义脚本能覆盖到每个项目，给这部分代码重用带来了极大便利。比如，不少项目会添加自定义脚本来约束`git commit`提交时的消息描述，在`lerna`架构下，只需写一次即可。

#### eslint的重用
那些常常需要在根目录添加配置文件的第三方依赖，比如`eslint`、`prettier`、`babel`等，在`lerna`中无法简单粗暴的提升合并到一处。因此，对于`eslint`这种前端开发已不可或缺的工具，可以尝试将所有配置项抽取到独立项目，然后安装第三方依赖的方式引入，类似`eslint-config-airbnb`，`eslint-config-prettier`，`eslint-config-google`这样。

不得不说，即便不用`lerna`框架我们也可以这么做，只不过在`lerna`框架下修改立刻可见，方便了调试和开发。


### lerna框架下的CI/CD
多项目的结构无疑给`CI/CD`带来挑战，好在主流的CI框架能完美解决这个问题。比如在gitlab上，`only/changes`参数完全满足了我们的需求，让我们可以为每一个子项目设置单独的pipeline，比如现在我们设置一个pipeline，只当rntest项目下的文件被修改时才会触发：

![](https://user-gold-cdn.xitu.io/2020/7/10/1733709cb0553f09?w=1022&h=470&f=png&s=56019)

在lerna框架下，所有项目都合在一个工程里，但`CI/CD`并不必这样。通过把脚本中的关键参数配置到`CI/CD`的项目内里，共用同一份`.gitlab-ci.yml`文件，从而能够实现每个子项目对应一个独立的`CI/CD`项目，最终`CI/CD`结构如下图：

![](https://user-gold-cdn.xitu.io/2020/7/10/1733717fab7eb8e3?w=1332&h=846&f=png&s=175590)

### lerna框架下的子项目权限
由于所有的项目都归并到了一个`lerna`工程下，一旦有了访问权限意味着你可以修改所有子项目中的代码，在实际的开发工作中多多少少会带来一些麻烦。比如说，开发web和开发mobile平台的是两个不同的团队，假如我作为web组的一员，一不小心修改了或删除了mobile项目的文件该怎么办？假如不加入任何限制，这种事情迟早会发生，我想这可能是`lerna`框架与生俱来的的痛点。

不幸的是，在`lerna`框架下，gitlab或github这类第三方代码托管平台，本身的权限管理功能无法解决这问题。但好在有其他工具的帮助可以缓解这种痛，我尝试用来约束开源贡献者提交PR规范的工具`dangerjs`来完成权限分隔，利用的信息就是当前gitlab账号的用户名，看起来效果还不错。


![](https://user-gold-cdn.xitu.io/2020/7/13/1734528ea00cdce7?w=2134&h=1834&f=png&s=479655)

可以看到，此工具会在合并MR时，判断出我gitlab账号没有权限修改rntest子项目内的文件，从而禁止合并此MR，并将这些信息自动添加到MR的评论里。当然，脚本判断是自己写的仅用作演示，逻辑比较简陋，脚本代码如下：


![](https://user-gold-cdn.xitu.io/2020/7/13/17345291a0c5b1f1?w=2838&h=988&f=png&s=631394)

关于`dangerjs`的部分我会另写一篇文章详细介绍。


### 结语
大前端项目将会是前端发展的趋势，如何更好的管理大前端项目是每一位前端开发躲不开的课题。`lerna`框架通过合而为一的理念提供了一种解决方案，通过扬长避短，我们可以发挥出`lerna`的最大效用。假如你还没有用过，也许，下一个项目就可以试试看。


> **相关资料**

> [yarn的workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)

> [lerna的github地址](https://github.com/lerna/lerna)

> [文章中的demo](https://gitlab.com/twomeetings/lerna-demo)
