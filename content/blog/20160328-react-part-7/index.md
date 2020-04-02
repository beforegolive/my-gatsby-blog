---
title: "React系列之七－组件间的通信－呈现组件和容器组件"
date: "2016-03-28"
---

在React中有一种常用的的设计模式，就是将组件分为呈现组件(presentatial component)和容器组件(container component),它们和MVC框架概念中的V和C很相似，呈现组件只负责呈现数据，而容器组件负责逻辑的处理。

现在我们创建一个示例，像[系列文章第三篇](/20151108-react-part-3)的例子那样调用豆瓣图书API获取信息，然后将信息呈现在页面上。首先，我们将所有逻辑写在一起，创建index.js，内容如下：

```
import React, { Component} from 'react'
import ReactDOM from 'react-dom'

class BookListContainer extends Component{
  constructor() {
    super()
    this.state={ books:[] }
  }

  componentDidMount(){
    var url="https://api.douban.com/v2/book/search?q=nodejs";
    $.ajax({
      type: "GET",
      dataType: 'jsonp',
      url:url
    }).done(function(result){
      this.setState({books:result.books})
    }.bind(this))
  }

  render(){
    return(
      <ul>
        {this.state.books.map(e=><li key={e.id}>{e.title}</li>)}
      </ul>
    )
  }
}

ReactDOM.render(
  <BookListContainer />,
  document.getElementById('demo7')
)
```

编译后，呈现页面如下：

`页面图片`

## 代码解析
BookListContainer组件的作用是，在组件初始化完毕后，异步请求豆瓣图书API，以nodejs为关键字，搜索相关图书，并最后用html标签将数据呈现在页面上。

如果按照功能划分的话，BookListContainer组件只做了两件事：获取数据和呈现数据。两种功能放在同一个组件会导致组件的复用性受到限制，因此，我们现在按照设计模式，将BookListContainer组件中呈现数据的部分抽离出来，作为一个单独的组件，叫BookListPresentation，代码如下：

```
class BookListPresentation extends Component {
  render(){
      var books = this.props.books;
      return (
        <ul>
          {books.map(e=><li key={e.id}>{e.title}</li>)}
        </ul>
      )
  }
}
```

因此BookListContainer对render方法就不必再负责呈现逻辑，直接使用BookListPresentation组件：

```
render(){
    return(
      <BookListPresentation books={this.state.books} />
    )
  }
```

这样做可以让呈现组件能复用在其他地方，假如呈现逻辑改变了，直接替换掉呈现组件就可以了，这也一定程度上保证了容器组件的复用。

而且，由于将呈现逻辑抽离，呈现组件内部不需要用到state或其他复杂的功能，正好适用[前文提过的stateless写法](/20160316-react-part-6)，从而进一步减少代码量，提高效率。比如此处BookListPresentation可改写为如下内容：

```
var BookListPresentation = ({ books })=>
    <ul>
      {books.map(e=><li key={e.id}>{e.title}</li>)}
    </ul>
```

#### 结语
将组件中的呈现逻辑和数据业务逻辑分离开来，可以很大程度上提高组件的复用性，而且让不需要复杂功能的呈现组件可以充分利用react特性和ES6语法糖减少代码量，提高效率。

本文的示例可在[示例代码](https://github.com/twomeetings/reactExamples)的demo7目录中查阅。

#### 参考链接

1. https://medium.com/@learnreact/container-componentsc0e67432e005#.jww2ntlwh
2. https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.ehf25rep4