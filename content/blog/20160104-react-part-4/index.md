---
title: "React系列之四－扩展知识点ref和mixin"
date: "2016-01-04"
---

### React系列之四－扩展知识点ref和mixin
在创建完组件后，我们常常需要获得对内部某个控件的值，比如说在[系列文章第二篇中](/20150721-react-part-2)，我们在下拉框的onChange事件中获取并保存了下拉框的值，而获取值的途径是通过方法参数的属性：event.target.value，代码如下。

```
_handleChange(event){
    this.setState({selectedColor: event.target.value});
  }
```

这是onChange事件提供的关于控件自身相关的参数。那么，假如我想在一个控件的事件中获取另外一个控件的值该怎么办？比如说，点击一个按钮，获取并保存其另一个输入框的值，这种情况下，通过事件内部的参数是读取不到的，而解决的办法是－ref属性。

### ref属性用法

现在创建一个包含输入框和按钮的组件，添加index.js文件，内容如下：

```
import React from 'react'
import ReactDOM from 'react-dom'

var InputButton=React.createClass({
  getInitialState(){
    return { val: ''}
  },
  render(){
    var val=this.state.val;
    return(
      <div>
        <input ref={c=>this._input=c }/>
        <button onClick={this._handleClick}>Go</button>
        <p>input value : <b>{val}</b></p>
      </div>
    )
  },
  _handleClick(){
    this.setState({val: this._input.value})
  }
})

ReactDOM.render(
  <InputButton />,
  document.getElementById('demo4')
)
```

代码中input控件包含了一个ref属性，这个属性的须是方法，且该方法的第一个参数已经指明，就是这个控件本身。代码中将这个参数赋值给了实例的_input属性，从而可以让其他控件的事件方法内调用。

```
<input ref={c=>this._input=c }/>
```

在react的早期可以给ref赋值字符串，比如某个控件的Id，这样也能到达相同的效果，但随着react版本的升级，给ref属性赋值字符串的方式不再推荐。

> "c=>this._input=c" 这种写法是ES6对javascript函数语法的扩张，详情可参考[此处](http://es6.ruanyifeng.com/#docs/function#箭头函数)
 
### mixins属性用法
假如你有使用过Ruby语言，对mixin这个单词就不会陌生，它巧妙的让ruby语言拥有多重继承的好处，同时避开了多重继承的复杂性。简单来说，mixin让两个不相干的类之间也能共享其通用的功能。

现在，我们添加一个对象，一个自定义方法_alertMessage和一个事件方法componentDidMount, 作用是当组件加载完毕后出现弹窗信息。

```
var mixinObject={
  componentDidMount(){
    this._alertMessage('completed');
  },
  _alertMessage(msg){
    alert(msg);
  }
}
```

然后上文中的InputButton组件可以通过mixins属性来把这个对象容纳进来。部分代码如下：

```
var InputButton=React.createClass({
  mixins:[mixinObject],
  getInitialState(){
    return { val: ''}
  },
  ...
```
  
重新刷新页面会发现组件加载完毕后会有弹窗，尽管组件本身并没有在componentDidMount事件中添加任何代码，而且InputButton组件内部也可以使用_alertMessage这个自定义方法了。

无论是自定义方法还是事件方法都能过通过mixins融入到一起，而mixins属性本身接受一个数组，可一次性融入多个mixin。当有多个mixin对象存在且每个对象都在同一个事件方法（比如componentDidMount方法）中有代码逻辑时，执行顺序和mixins数组中的顺序一致，排在前面的先执行。

### 代码示例
本文的[代码示例](https://github.com/twomeetings/reactExamples)在demo4目录中查找。