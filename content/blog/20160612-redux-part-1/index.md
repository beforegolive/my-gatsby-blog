---
title: "Redux系列之一－开篇"
date: '2016-06-12'
---

### Redux是什么？
React的开发需要配合一种前端框架来组织代码，使得项目能易于维护和扩展。大家熟知的前端框架就是MVC，然而facebook的开发人员在尝试了React＋MVC模式之后，发现其并不适合开发大型应用，便采用了一种新的前端架构，叫Flux。

但其实，Flux本身是一种架构思想，除了官方点Flux框架外，开源社区围绕这个架构思想开发了很多相似的框架，Redux就是其中一个，而且是目前人气最高的一个。

### Flux和MVC的对比
关于弃用MVC，Facebook官方给出了一个案例，在facebook页面上存在两个View，一个是消息列表，一个是未读消息气泡，每次有新的消息进来时，除需更新消息列表的Model之外，还要处理未读消息数的Model，这导致了数据更新之间的联动，看似独立的View和Model之间存在了依赖。因此在逻辑复杂的大项目中，更新联动就让调试和维护变的困难，facebook将这个问题归结为MVC架构的数据双向绑定，并给出了下图。

![](http://7xtbg7.com2.z0.glb.clouddn.com/redux1-1.png)

针对双向绑定的问题，Flux就应运而生了，这种框架包含4个部分，如果与MVC相对照的看，Model变成成了Store，Controller变成了Dispatcher和Action，View依然是View。除了各个概念与MVC有略微差异外，Flux最大的特点就是数据的单向流动，极大的提高了逻辑的可预测性，从而让架构变的简洁，易于维护。

![](http://7xtbg7.com2.z0.glb.clouddn.com/redux1-2.png)

### 简易示例
现在让我们用redux创建一个实例，比官方示例更加简单的计数器，内容是点击一下按钮，对应的数值加1。示例的框架使用了webpack＋react＋redux的形势，如果对webpack和react不熟悉，则可以先阅读我之前所写的[react系列文章](/20150712-react-part-1)。

搭建好项目，安装好webpack和react的相关的安装包后，要记得安装redux，命令如下：
```
npm install redux --save
```

### View－呈现数据
首先我们创建一个Counter类（counter.js），用于数据呈现：
```
import React, { Component, PropTypes } from 'react'

class Counter extends Component{
  render(){
    var { value, handleClick} = this.props;
    return(
      <div>
        Clicked: {value} times
        <p>
          <button onClick={handleClick} >Button</button>
        </p>
      </div>
    )
  }
}

Counter.propTypes={
  value:PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default Counter
```
Counter类的呈现逻辑中，需要用到两个属性值value和handleClick，一个是数值，一个是方法，并且用PropTypes对这两个属性做了必填的限制。
```
Counter.propTypes={
  value:PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired
}
```

### Action－数据载体
在Flux框架中，处理逻辑的部分（即MVC中的Controller）被分成了两块Action和Dispatcher。

Action时执行操作所需的数据载体，相当于传入的参数。它是一个对象，该对象必须包含一个type属性，type属性表示类型，方便dispather识别。本例中的action对象如下：
```
{ type:'INCREMENT' }
```

常见的写法中，action对象不会直接编写，而是通过一个方法返回，这种方法就叫“action creator”，本例中假如采用action creator的写法会是下面这样：
```
function AddCounter(){
  return { type: 'INCREMENT'}
}
```
这看似多余的一步，却可以给action带来极大的扩展性，这在后文会提及。

### Dispatcher－(Reducer)逻辑处理
Dispatcher的作用是则是针对不同的Action做相应的逻辑处理，最终在组件的state上做相应的修改，所以Dispatcher常常是一个方法。本例中的Dispatcher创建在reducer.js文件中，内容如下。

```
function counterReducer(state = 0, action){
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    default:
      return state;
  }
}

export default counterReducer;

```
因为Dispatcher是根据action来操作state，所以它的常规写法是一个包含了两个参数的函数，一个是state，一个是action。
本例中，当Dispather的逻辑是，当收到类型为INCREMENT的action时，将state加1。

> 在Redux中，Dispatcher又叫Reducer，这是因为它的核心方法是javascript中数组的reduce方法，故以Reducer来命名，该方法详情可查看[此站点](https://msdn.microsoft.com/zh-cn/library/ff679975(v=vs.94).aspx)

### Store－数据保存
在Redux中，数据持久化的方式是所有的state数据都保存在一个全局对象中，这个对象就是Store。在redux中创建Store对象非常简单，利用模块方法createStore即可。
```
import {createStore} from 'redux'
import Reducer from './reducer.js'

const store = createStore(Reducer)
```
可以看到createstore方法的参数是我们上节中定义的Reducer(即Dispatcher)，所以Dispather和Store是挂靠在一起的。

当有action传入时，Store会依次遍历自身所有的Reducer，根据type做相应处理，并将修改后的值保存在全局state对象中。

Store对象有三个方法，就是用来完成上述工作：
1. getState。－获取当前state。
2. dispatch。 －接收并处理action
3. subscribe。 －订阅事件，当state更新时，刷新对应的组件

本例中与Store这三个方法的相关代码如下：

```
import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'

import Counter from './counter.js'
import Reducer from './reducer.js'

const store = createStore(Reducer)

function customRender(){
  ReactDOM.render(
    <Counter
      value = {store.getState()}
      handleClick={()=> store.dispatch({type:'INCREMENT'})}
    />,
    document.getElementById('demo1')
  )
}

customRender()
store.subscribe(customRender)
```

### 结语
本系列的示例代码可在[此处](https://github.com/twomeetings/reduxExample)下载，本文代码在目录demo1中。
