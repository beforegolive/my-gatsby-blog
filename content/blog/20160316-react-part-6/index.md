---
title: "React系列之六－stateless组件的写法"
date: "2016-03-16"
---

### 函数就是stateless组件
前文介绍了编写react组件的两种写法，React写法和ES6写法，除此之外还有一种编写组件的写法，而这种写法编写的组件会略有不同，这样的组件叫stateless组件。顾名思义，stateless组件就是没有状态的组件，这种组件的写法基本等同于javascript的函数，函数的参数就是组件的props属性。

现在我们用这种写法重写[系列文章第一篇](/20150712-react-part-1)的示例，添加index.js文件，内容如下：

```
import React from 'react'
import ReactDOM from 'react-dom'

function HelloMessage(props){
  return (<div>Hello {props.name}, {props.year}!</div>)
}

ReactDOM.render(
  <HelloMessage name="Jacky" year='2016'/>,
  document.getElementById('demo6')
)
```

代码中可以看到，HelloMessage组件就是函数HelloMessage，函数的返回值就是组件要呈现的内容，等同于组件的render方法。与返回值与以往函数的区别是：字符串作为其返回值不是用引号包裹，而是括号。

函数的参数就是组件的props，而这种组件不支持state，这也是组件名称的由来。除此之外，这种组件不支持ref属性，没有组件生命周期相关的事件方法，但支持propTypes，写法和[ES6组件写法](/20160301-react-part-5))一样。

```
HelloMessage.propType = { name: Proptypes.string.isRequired}
```


因此，这种组件的作用就是用来简单的呈现数据，最大的特点就是编写方便。


### 箭头函数
在ES6的语法里，函数可以有一种写法叫箭头函数，比如上面的HelloMessage组件箭头函数编写后，代码如下：

```
var HelloMessage=(props)=>{
  return (<div>Hello {props.name}, {props.year}!</div>)
}
```

而且箭头函数可以进一步简化：

```
var HelloMessage=(props)=> <div>Hello {props.name}, {props.year}!</div>;
```

可以看到stateless组件的写法是三种写法里最简洁的。

### 解构赋值

解构是ES6的新赋值语法，变量可以通过解构赋值，简单来说就是可以从对象中抽取值给变量。像下面代码这样，变量a和b可以直接从obj对象中提取属性值，前者等于name，后者等于year。

```
var obj={name: 'jacky', year:2016 }
 var {name:a, year:b} = obj;
 console.log(a); // jacky
 console.log(b); // 2016
```

通过解构给变量赋值，需要被包裹在花括号内。且当变量名和对象的属性名一样时，语法可以进一步简化，如下，变量name和year直接就被赋了obj的属性name和year的值：

```
var obj={name: 'jacky', year:2016 }
var {name, year} = obj;
```

> 解构也可以用在数组，关于解构的详细的说明可以在阮一峰老师的文章：[ECMAScript6入门](http://es6.ruanyifeng.com/#docs/destructuring)里查看。

当解构和箭头函数组合在一起时，我们的stateless组件的写法可以做进一步的改变：

```
var HelloMessage=({name, year})=> <div>Hello {name}, {year}!</div>;
```

可以看到解构赋值直接用在了函数的第一个参数，props的name和year属性被赋给了name和year变量。

注意，这种简化的解构写法中，变量名一定要和对象对属性名一致，而正常的函数的参数名可以使任意的字符串，比如原写法里的props参数就可以换成任何p，或任何想要的名字。

```
var HelloMessage=(p)=> <div>Hello {p.name}, {p.year}!</div>
```

因此，当看到一个箭头函数时，判断其参数是否使用解构显得格外重要。判断的依据就是，解构变量需要被包含在花括号内。

### 本文示例
本文的示例可以在[示例代码](https://github.com/twomeetings/reactExamples)中的demo6目录中找到。