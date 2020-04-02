---
title: "React系列之三 － 组件的事件"
date: "2015-11-08"
---

React组件从创建到注销的过程中需要经历一个生命周期，在这个周期内会触发一系列的方法事件，利用这些事件，可以让组件处理更复杂的逻辑。

使用过jquery的一定知道，jquery的一个常见用法是，当页面DOM元素加载完成后，再开始一些逻辑操作，写法如下：

```
$(function(){
	// do something
})
```

那么，这个功能在react中该怎样实现呢？答案是通过事件中的componentDidMount方法。

现在我们编写一个异步加载数据的示例，当组件加载完毕后，异步请求豆瓣的图书API并在页面上显示评分，index.js代码如下：

```
import React from 'react'
import ReactDOM from 'react-dom'

var AjaxGetData= React.createClass({
  getInitialState(){
    return {rating: 0}
  },
  render(){
    var rating=this.state.rating;
    return(
      <div>书籍：《满月之夜白鲸现》 的豆瓣评分：{rating}分</div>
    )
  },
  componentDidMount(){
    var url='https://api.douban.com/v2/book/6548683';
	 $.ajax({
        type: "GET",
        dataType: 'jsonp',
        url: url
      }).done(function(json){
        var rating = json.rating.average;
        this.setState({rating:rating});
      }.bind(this));

  }
})

ReactDOM.render(
  <AjaxGetData />,
  document.getElementById('demo3')
)
```

> 关于豆瓣图书API文档可查阅[此处](https://developers.douban.com/wiki/?title=book_v2#get_isbn_book)。

> 注意，在ajax请求的done方法后面多了一个bind(this)，后面文章会详细讲解此点。

### 代码解析
在上面代码中可以看到，组件中多了一个componentDidMount方法，该方法在组件加载完毕后会触发，且只会触发一次。与之对应多还有一个事件方法是componentWillMount，表示组件的render方法执行前触发。

假如我们在这三个方法内加入调试信息比如：console.log(方法名)，则得到这三个方法的执行顺序如下：

```
componentWillMount
render
componentDidMount
```

前文说过，当组件的state值改变时，组件会刷新，并导致render方法重新执行。但是componentWillMount和componentDidMount只会执行一次，直至被销毁。

### shouldComponentUpdate方法
shouldComponentUpdate是react组件生命周期中的一个重要方法，它觉得着是否需要刷新组件，当它返回true时则刷新组件，返回false，则不必。它默认的判断依据是state是否改变，我们也可以根据自己的需求来修改刷新条件，比如像下面这样，只有当id属性改变时，才刷新组件。

```
shouldComponentUpdate(nextProps, nextState): {
  return nextState !== this.state.id;
}
```

一旦shouldComponentUpdate返回true，确定更新，render的前后会执行另外一对事件方法，它们是componentWillUpdate和componentDidUpdate。加入调试信息，可看到组件更新导致的这四个方法的触发顺序是：

```
shouldComponentUpdate
 componentWillUpdate
 render
 componentDidUpdate
```
 
>  其他的事件方法，可在[官网此处](https://facebook.github.io/react/docs/component-specs.html)查询。
 
### 示例代码
本文[示例代码](https://github.com/twomeetings/reactExamples)可在在目录demo3中查阅。