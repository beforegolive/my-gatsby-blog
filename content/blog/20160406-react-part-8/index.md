---
title: "React系列之八－组件的生命周期"
date: "2016-04-06"
---

在[系列文章第三篇](http://twomeetings.github.io/2016/03/03/React%E7%B3%BB%E5%88%97%E4%B9%8B%E4%B8%89%EF%BC%8D%E4%BA%8B%E4%BB%B6/)中，我们谈到了组件的事件，但只提到了其中两个事件方法，其实react组件的事件方法并不多，总共只有7个，如下：

```
componentWillMount
componentDidMount
componentWillReceiveProps
shouldComponentUpdate
componentWillUpdate
componentDidUpdate
componentWillUnmount
```

所有的这些事件拼成了react组件的生命周期，那么，在整个生命周期中，这些事件的顺序是怎样的？本文中，我创建一个示例，通过在每个事件中用console.log输出信息到控制台，来查看执行顺序，代码如下：

```
componentWillMount(){
    console.log('componentWillMount');
  }
```

然后创建一个类似[系列文章第二篇](http://twomeetings.github.io/2016/02/20/React%E7%B3%BB%E5%88%97%E6%96%87%E7%AB%A0%E4%B9%8B%E4%BA%8C%EF%BC%8DpropType/)中的组件，可以通过选中下拉框，来改变组件本身的state，这也就可以观察到组件初始化时和状态改变时，两种状态下的生命周期。现在，创建index.js，基本代码如下：

```
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class SimpleComponent extends Component{
  constructor() {
    super()
    this.state={selectedValue: '' }
  }

  _handleChange(event){
    this.setState({selectedValue: event.target.value})
  }

  render(){
  	console.log('render')
    return(
      <div>
        <select onChange={this._handleChange.bind(this)} >
          <option value=''></option>
          <option value='nodejs'>nodejs</option>
          <option value='react'>react</option>
        </select>
        <p>selected value is : {this.state.selectedValue}</p>
      </div>
    )
  }
  
  /.../
}
```
> 这里为了让代码简洁，为省略了只有console.log的7个事件方法，详情可在代码示例中查看。

编译后页面如图所示：
`
图片
`

现在，我们观察浏览器控制台，当页面初始化时，我们得到信息如下，可以看到加上render方法，只有3个事件方法被触发：

```
componentWillMount
render
componentDidMount
```

然后，选中下拉框来修改组件state状态，得到如下信息：

```
shouldComponentUpdate
componentWillUpdate
render
componentDidUpdate
```

### 复杂组件的生命周期
从上文到演示中可以看到单个组件初始化和状态改变时的生命周期，但奇怪的是，7个生命周期事件中，只有5个被触发，另外两个在什么情况下才会触发呢？

现在我们将组件设计的复杂一些，结合[系列文章第七篇](http://twomeetings.github.io/2016/03/29/React%E7%B3%BB%E5%88%97%E4%B9%8B%E4%B8%83%EF%BC%8D%E7%BB%84%E4%BB%B6%E9%97%B4%E7%9A%84%E9%80%9A%E4%BF%A1/)中的容器组件和呈现组件的例子，当用户选择了下拉框之后，根据选中内容请求豆瓣图书API获取图书，再将书名呈现出来。在这样的情况下，我们观察一下容器组件和呈现组件的生命周期会是怎样的。

页面呈现如下：

![](http://7xtbg7.com2.z0.glb.clouddn.com/React8-1)

现在，我们用蓝色表示容器组件的生命周期，绿色组件表示呈现组件的生命周期。初始化时，控制台信息如下：

![](http://7xtbg7.com2.z0.glb.clouddn.com/React8-2)

选择下拉框，改变状态以后，控制台信息如下：

![](http://7xtbg7.com2.z0.glb.clouddn.com/React8-3)


### 结语
本文代码可在[示例代码](https://github.com/twomeetings/reactExamples)中的demo8目录中查询。