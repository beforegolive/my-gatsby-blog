---
title: "React系列之五－ES6语法编写组件"
date: "2016-03-01"
---

从前面到文章可以知道，当我们想要编写react组件时，就需要调用React.createClass方法，这是创建组件的常用方法，但除此之外，还有两种写法经常出现在开源代码中，那就是ES6写法和stateless写法。

### ES6写法
顾名思义，这种就是利用ES6的语法来编写组件，详细的ES6语法可参考阮一峰老师的[ECMAScript 6入门](http://es6.ruanyifeng.com/)，这里不再赘述。

本文用ES6写法来编写上篇文章的示例，以方便比较两者之间的不同。创建index.js，内容如下：

```
import React, { Component} from 'react'
import ReactDOM from 'react-dom'
import Mixin from 'react-mixin'

let mixinObject={
  componentDidMount(){
    this._alertMessage('completed');
  },
  _alertMessage(msg){
    alert(msg);
  }
}

class InputButton extends Component {
  constructor() {
    super()
    this.state={
      val:''
    }
    Mixin.onClass(InputButton, mixinObject);
  }

  render(){
    var val=this.state.val;
    return(
      <div>
        <input ref={c=>this._input=c }/>
        <button onClick={this._handleClick.bind(this)}>go Button</button>
        <p>input value : <b>{val}</b></p>
      </div>
    )
  }

  _handleClick(){
    this.setState({val: this._input.value})
  }
}

ReactDOM.render(
  <InputButton />,
  document.getElementById('demo5')
)
```

### 两种写法的区别
可参考上篇中的写法，在这里比较两种组件写法之间的差别。为方便说明，在这里称React.createClass创建组件的写法为React写法，而利用ES6语法创建组件的写法则称为ES6写法。
#### 组件的声明
在ES6写法中组件被看作是类，通过类的声明来创建组件，类必须要继承React.Component组件，类名就是要创建的组件名。因为是类，方法和属性之间不必添加逗号。

```
class InputButton extends React.Component {}
```

而React写法中，组件是React.createClass方法的返回值，由组件名是变量的名字。由于组件的属性和方法来自于一个对象，因此需要用逗号隔开。

```
var InputButton=React.createClass({})
```

#### state的初始化
在ES6写法中，初始化的工作要放在类的构造函数里，即constructor方法。在构造函数中，只需对this.state赋值一个对象就完成来state的初始化。

```
constructor() {
    super()
    this.state={
      val:''
    }
 }
```
 
 在React写法中，初始化state则需要用getInitialState方法。
 
 ```
 getInitialState(){
    return { val: ''}
  }
 ```

> 在ES6写法里，假如类有父类，则构造函数第一句必须是super()，用来初始化父类的相关信息，否则会出错。

#### props的默认值
ES6的类声明中，无法设置props的默认值，只能在类的主体之外，使用defaultProps属性，来完成对默认值的设置。

```
class InputButton extends React.Component{...}
InputButton.defaultProps = { initialCount: 0 };
```
在React写法中，通过getDefaultProps方法来完成默认值的设置。

```
	getDefaultProps(){
		return { initialCount: 0 };
	}
```

#### propTypes的写法
在[此系列文章第一篇](/20150712-react-part-1))我们提到了propTypes，它可以对组件所需要的属性做验证，从而让组件的调用方了解如何正确使用该组件，当时的React写法是：

```
propTypes:{
    year: PropTypes.number.isRequired
  }
```

而ES6的写法与设置props的默认值类似，需要在类的主体之外，用propTypes属性来设置，写法如下：

```
class InputButton extends React.Component{...}
InputButton.propTypes = {
	year: PropTypes.number.isRequired
};
```

#### 对mixin的支持
[上篇文章](/20160104-react-part-4)中，我们用React写法创建的组件中通过设置mixins属性，添加了mixin功能，让两个不相干的类之间也能共享属性和方法。

```
var InputButton=React.createClass({
  mixins:[mixinObject],
  getInitialState(){
    return { val: ''}
  },
```

可惜的是，ES6写法目前并不支持mixin，只能通过第三方的组件来实现mixin。本例中使用了react-mixin组件来添加mixin功能，写法如下：

```
import Mixin from 'react-mixin'
class InputButton extends Component {
  constructor() {
    super()
    this.state={
      val:''
    }
    Mixin.onClass(InputButton, mixinObject);
  }  
```
  
 除此之外，还有其他的第三方组件提供mixin功能，而且在不久的将来，ES7的语法中也会加入了对mixin的支持。所以从目前来看，当你需要mixin功能的组件时，选择React写法会比较有利。
 
>  react－mixin组件的详细信息可[点击此处查看](https://github.com/brigand/react-mixin)

#### 方法绑定this
在本例的ES6写法中，button控件的onClick事件和React写法略有不同，在方法的最后多了.bind(this)。

```
<button onClick={this._handleClick.bind(this)}>go Button</button>
```

bind是javscript自带的方法，bind(this)的作用是为了让对应方法的内部实现能通过this引用到当前组件的实例。所以在本例中是为了让_handleClick方法内部能够使用this.setState方法。

```
_handleClick(){
    this.setState({val: this._input.value})
  }
```
  
相似的写法还有this.props，this.state等等，假如组件中的方法内部通过this引用了实例的属性和方法，在ES6写法中就必须在最后添加.bind(this)，否则会出错。

React写法不需要bind(this)，因为React.createClass()会将参数对象中的所有方法都自动绑定.bind(this)，换言之，React写法也需要绑定this，但createClass帮我们做了绑定的逻辑，省去了手工编写的麻烦。

但是假如方法内部的方法也需要引用组件示例的方法（比如this.setState）该怎么办？这种情况createClass不能帮忙自动绑定，只能自己手动操作。在之前的[系列文章－组件的事件](http://twomeetings.github.io/2016/03/03/React%E7%B3%BB%E5%88%97%E4%B9%8B%E4%B8%89%EF%BC%8D%E4%BA%8B%E4%BB%B6/)中，有一段jQuery异步请求的代码，在回调函数中使用了this.setState，所以在方法后面添加了.bind(this)。

```
$.ajax({
        type: "GET",
        dataType: 'jsonp',
        url: url
      }).done(function(json){
        var rating = json.rating.average;
        this.setState({rating:rating});
      }.bind(this));
```
      
###  示例代码
本文的代码可查看[示例代码](https://github.com/twomeetings/reactExamples)的demo5目录。