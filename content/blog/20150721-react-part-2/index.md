---
title: "React系列之二 － state"
date: "2015-07-21"
---

大多数情况下，我们创建的组件不需要用到state，只需处理props属性，然后将其呈现出来。但是有时组件中需要应对用户的输入，这时就必须用到state来保存变化的值。

我们现在创建一个含有下拉框的组件，当用户选择了下拉框时，用state记录用户选择的内容。现在创建index.js，内容如下：

```
import React from 'react'
import ReactDOM from 'react-dom'

var UserInput= React.createClass({
  getInitialState(){
    return {selectedColor:''}
  },
  render(){
    var color= this.state.selectedColor;
    return(
      <div>
        <select onChange={this._handleChange}>
          <option value=''></option>
          <option value='red'>Red</option>
          <option value='blue'>Blue </option>
          <option value='green'>Green </option>
        </select>
        <p>selected color is : {color} </p>
      </div>
    )
  },
  _handleChange(event){
    this.setState({selectedColor: event.target.value});
  }
})

ReactDOM.render(
  <UserInput />,
  document.getElementById('demo2')
)
```
### state初始化
从代码中可以看出，UserInput组件和[上一篇](http://twomeetings.github.io/2016/02/10/React%E7%B3%BB%E5%88%97%E6%96%87%E7%AB%A0%E4%B9%8B%E4%B8%80%EF%BC%8D%E5%BC%80%E7%AF%87/)的例子相比，多了getInitialState方法，该方法通过返回一个对象来初始化state，最终对象的属性和state属性一致。

```
getInitialState(){
    return {selectedColor:''}
  }
```

状态值的读取和props相似，不同的是要用state保留字。

```
var color= this.state.selectedColor;
```

### state修改
state的修改有别于以往常见的修改方法，它不是直接操作对象this.state，而是创建新的对象将原对象替换，使用方法this.setState。

在示例中的onChange事件中，直接将下拉框选中的值赋予state的selectedColor属性。

```
this.setState({selectedColor: event.target.value});
```

> event是onChange事件的参数，event.target.value是常用属性，用来读取修改后的控件参数，其他的属性可参考[官网此处](https://facebook.github.io/react/docs/events.html#form-events)

## props和state的比较
props和state在组件中都可以用来承载数据，不过它们是有区别的。

props通常由外部调用时指定，一旦定下就不可更改，因此它常常和初始化联系到一起。不可更改的特性也意味着更好的性能。react开发中有一种开发模式就是父子组件，父组件和子组件之间的通信基本通过props。

state在组件内部操作，是可变的，常常用来应对有用户输入的场景，比如本例中用来记录下拉框选中的值。每次state的值改变，整个组件就会重新呈现一次，过于频繁的改动有可能会导致性能问题。

> 可查看[官方网站](https://facebook.github.io/react/docs/interactivity-and-dynamic-uis.html#components-are-just-state-machines)给出的使用state的建议。

### 示例代码
本篇的[示例代码](https://github.com/twomeetings/reactExamples)可在demo2文件夹中查找。