---
title: "Redux系列之三－Action的简化：bindActionCreator方法"
date: '2017-01-19'
---

### Action和Action Creator

Action是Redux中的核心概念之一，它是信息的载体包含跟操作指令相关的信息，因此它是一个必需包含type属性的对象，type表示我们自定义的指令类别。

```
{
	type: 'SOMETHING',
	//...
}
```

发送指令需调用Store的方法dispatch，比如在[前文](http://twomeetings.github.io/2016/04/18/Redux%E7%B3%BB%E5%88%97%E4%B9%8B%E4%BA%8C%20%EF%BC%8D%20combineReducers/)的示例中，三个Counter组件通过dispatch分别发生了不同类别的指令：INCREMENT, OTHER_INCREMENT, DOUBLE_INCREMENT。相关代码如下：

```
		<Counter
        value = {state.counterReducer.value}
        handleClick={()=> store.dispatch({type:'INCREMENT'})}
      />
      <Counter
        value = {state.counterReducer.otherValue}
        handleClick={()=> store.dispatch({type:'OTHER_INCREMENT'})}
      />
      <Counter
        value = {state.secondReducer.value}
        handleClick={()=> store.dispatch({type:'DOUBLE_INCREMENT'})}
      />
```

有时，action会包含一些逻辑，因此，在redux中，通常会用一个方法来创建action，这样的方法叫‘action creator’。比如，创建INCREMENT类别的action，可创建一个increment方法，写法如下：

```
function incremment(){
  return {
    type: 'INCREMENT'
  }
}

```
### 简化Action指令的发送

上节看似多此一举的写法，实际上给redux带来了很多扩展性和便利。redux中发送action总需要调用Store的dispatch方法，如下。

```
()=> store.dispatch({type:'INCREMENT'})
```

redux提供了bindActionCreator方法，可以将action和dispatch结合在一起，达到简化写法的目的。

现在我们创建一个action.js，添加三个方法用于创建那三个组件需要的action。

```
export function incremment(){
  return {
    type: 'INCREMENT'
  }
}

export function otherIncremment(){
  return {
    type: 'OTHER_INCREMENT'
  }
}

export function doubleIncremment(){
  return {
    type: 'DOUBLE_INCREMENT'
  }
}

```

在入口文件(index.js)中，我们引入并调用bindActionCreator，将其与dispatch合并。

```
mport {createStore, combineReducers, bindActionCreators} from 'redux'
import {counterReducer, secondReducer} from './reducer.js'
import * as actionCreators from './action.js'

var reducers=combineReducers({counterReducer,secondReducer})

const store = createStore(reducers)

var boundActionCreators = bindActionCreators(actionCreators, store.dispatch)

```

> 此处import * as actionCreators，是引入模块的一种写法，作用是将模块中所有导出的部分引入并命名为一个变量，import命令的详细信息可参考阮一峰老师的[ES6入门](http://es6.ruanyifeng.com/)

绑定后的boundActionCreators对象结构如下：

```
{
	incremment: function(){/.../},
	otherIncremment: function(){/.../},
	doubleIncremment: function(){/.../}
}
```

通过bindActionCreator方法的绑定，每次发送Action指令时，就不必再添加调用dispatch方法，或者说通过绑定，dispatch方法会自动被调用。因此入口文件(index.js)的组件呈现部分，就可以改动如下：

```
ReactDOM.render(
    <div>
      <Counter
        value = {state.counterReducer.value}
        handleClick={boundActionCreators.incremment}
      />
      <Counter
        value = {state.counterReducer.otherValue}
        handleClick={boundActionCreators.otherIncremment}
      />
      <Counter
        value = {state.secondReducer.value}
        handleClick={boundActionCreators.doubleIncremment}
      />
    </div>
    ,
    document.getElementById('demo3')
  )
```

### 结语

Action是Redux中的核心组件，承载着指令相关的信息，创建Action的方法有两种，直接手写和通过方法返回，而redux推荐后一种方法，并且提供了bindActionCreator方法来简化Action指令发送相关的代码。

示例代码可以在[此处下载](https://github.com/twomeetings/reduxExample)，本文相关的代码可在目录demo3中寻找。