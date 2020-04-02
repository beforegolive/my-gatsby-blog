---
title: "React系列之一 － 开篇"
date: "2015-07-12"
---

### 前言
React是Facebook公司创建的框架，起始于2011年，起初只在其公司内部使用，在2012年应用于Instagram项目，之后于2013年5月开源。紧接着基于React框架基础上，facebook又推出来React Native框架用于Ios和Android应用的开发，并于2015年2月正式开源，据说开源当天就备受瞩目，在github上获得5000颗星。

到我写下这篇文章为止，不到短短一年时间，react相关的框架正逐渐改变手机端开发的格局。利用react native编写的javascript代码可以同时跑在苹果和安卓系统上，根据facebook官方博客描述的广告项目中，80%的代码可以重用。学习React无疑为前端开发人员拓宽了职业道路。

本系列相关的示例代码使用webpack＋react的架构，详细的配置和搭建步骤可以参考[Webpack系列文章的这一篇](/20160108-webpack-part-1)，本文不再赘述。

### 属性props

在之前的webpack和react结合的教程里，我只做了简单的示例，即在html标签中显示一段文字，在本文的例子中我们引入react中的基本元素props。

首先在一个空目录下，初始化项目名reactExample，并搭建webpack和react环境，详细做法可参考前言中的链接。

创建index.js文件，内容如下：

```
import React from 'react';
import ReactDOM from 'react-dom'

var HelloName= React.createClass({
  render(){
    var name=this.props.myName;
    return(
      <p>Hello {name}!</p>
    )
  }
})

ReactDOM.render(
  <HelloName myName='Jacky' />,
  document.getElementById('demo1')
)
```

这段代码有以下四点说明：
#### import语法
import是ES6的特性，作用类似require，作用都是引用模块，因此下面两段代码作用一样，都是引入react模块，并将其赋值为一个名为React的变量，这个变量名可以是任何符合规则的字符串。

```
import React from 'react'
// 等同于
var React = require('react')
```

ES6中，这种引入方式对应模块的默认输出变量，但一个模块只能允许一个默认输出变量，引用其他输出变量时，需要将其变量写准确，否则会出错。import通过花括号来引用非默认变量，比如像下面这样：

```
import {render} from 'react-dom'

```

那么对应的require语句就要写成这样：

```
var render=require('react-dom').render
```

这种引用方法也很常见，假如本例的引用语句写成了这样，那么index.js文件的最后一句需要去掉ReactDOM，改成下面这样：

```
render(
  <HelloName myName='Jacky' />,
  document.getElementById('demo1')
)
```

> 关于模块import和export的详细解释可参考阮一峰老师的[ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/module#import命令)的Module章节
 
#### React.createClass方法
React.createClass方法可以创建自定义的组件，该说React.createClass是组件的起点，该方法接受一个对象，必不可少的核心方法是render，该方法要返回的值表示最后的输出。在本例中返回p标签及其包含对内容。

```
<p>
    <label>{name}:</label>
    <input />
</p>
```

> 除render之外的其他的方法和属性可在官网查询，在随后的文章也会详细讲解。

#### ReactDOM.render方法

ReactDOM的render方法和刚刚提及的创建组件的核心方法重名，它的作用是将组件呈现在对应的HTML的DOM元素内。示例中的代码将LabelInput组件呈现在id＝demo1对HTML标签内。

```
ReactDOM.render(
  <LabelInput labelName='test1' />,
  document.getElementById('demo1')
)
```

ReactDOM.render方法除了组件和DOM标签两个参数外，还可以接受第三个回调函数，当组件呈现或更新完毕时会执行，具体信息可查看[官网](https://facebook.github.io/react/docs/top-level-api.html#reactdom.render)

#### 无需声明的props属性
在组件内部可以通过this.props访问属性值，比如在本例中我们访问了属性myName。

```
var name = this.props.myName;
```

但这属性是从哪来的？由于javascript对象的特性，属性不必声明就可以直接使用.也就是说当你编写组件时，需要某个属性就直接引用，比如我们修改render方法，再添加一个属性year。

```
var HelloName= React.createClass({
  render(){
    var name=this.props.myName;
    var year=this.props.year;
    return(
      <p>Hello {name}! {year}</p>
    )
  }
})
```

编译后刷新页面可发现，属性date并没有值。这是因为调用HelloName组件时，只给myName赋了值，这说明只有当调用组件时给属性赋值，其组件内部才能拿到对应的值，否则只能是undefine.

```
<HelloName myName='Jacky' />
```

那么，由于组件内部不必显示声明属性，当我们调用某个组件的时候，怎样才能知道它需要哪些属性呢？答案使用propType。

### 属性验证－propTypes

编写组件时，当需要某些特定类型或者必填的属性时，可以使用propTypes来完成需求。现在我们添加propTypes，year设置为数字类型且必填，改动后的index.js代码如下：

```
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom'

var HelloName= React.createClass({
  propTypes:{
    year: PropTypes.number.isRequired
  },
  render(){
    var name=this.props.myName;
    var year=this.props.year;
    return(
      <p>Hello {name}! {year}</p>
    )
  }
})

ReactDOM.render(
  <HelloName myName='Jacky'/>,
  document.getElementById('demo1')
)
```

更新后查看页面，会在控制台看到异常如下：

`bundle_demo1.js:1074 Warning: Failed propType: Required prop 'year' was not specified in 'HelloName'.`

这样在调用组件时，就能知道该组件需要什么样的属性了。PropTypes提供了一系列的验证方式，包括字符串，对象，方法，数组以及自定义验证，详细信息可点击[官网此处](https://facebook.github.io/react/docs/reusable-components.html#prop-validation)查看。

### 示例代码
示例代码可在[此处](https://github.com/twomeetings/reactExamples)下载，本文示例对应文件夹demo1。

### 参考链接
1. http://www.ruanyifeng.com/blog/2015/03/react.html
2. https://en.wikipedia.org/wiki/React_(JavaScript_library)
3. https://medium.com/react-tutorials/react-state-14a6d4f736f5#.ox10voa3x