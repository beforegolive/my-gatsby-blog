---
title: "Redux系列之二－Reducer的合并：combineReducers方法"
date: '2016-11-04'
---

前文的示例代码包含一个reducer，逻辑是state数值加1。那么当多个reducer存在时，redux是怎样在一个全局对象中管理状态的呢？现在，我们扩展例子，再添加一个Counter组件，并让两个Counter的值各自独立，相互不受影响。

```
// index.js
  ReactDOM.render(
    <div>
      <Counter
        value = {store.getState()}
        handleClick={()=> store.dispatch({type:'INCREMENT'})}
      />
      <Counter
        value = {store.getState()}
        handleClick={()=> store.dispatch({type:'OTHER_INCREMENT'})}
      />
    </div>
    ,
    document.getElementById('demo2')
  )
}
```
代码中可以看到，第二个Counter组件点击时，发送的Action类型和第一个不同，因为redux的机制，对Action多逻辑处理都放在在了Reducer中。在之前的reducer.js文件中，只有一个方法counterReducer，并且通过ES6语法将全局state初始化成了数值0，代码如下：

```
function counterReducer(state = 0, action){
  // ...
}
```
> 关于ES6中对方法参数的初始化写法，可参考阮一峰老师的[ES6入门](http://es6.ruanyifeng.com/)
 
记录多个值需要用到对象或数组，而常见的写法是将全局state当作对象，因此原方法counterReducer的逻辑需做修改，用state对象的value属性来记录数值。对于第二个组件，用otherValue属性来记录对应的值，这样可以保证两个组件不会冲突，代码如下：

```
function counterReducer(state = { value:0, otherValue:0 }, action){
  state.value =  state.value || 0;
  switch (action.type) {
    case 'INCREMENT':
      state.value++;
      return state;
    case 'OTHER_INCREMENT':
      state.otherValue++;
      return state;
    default:
      return state;
  }
}
```

此时的全局变量state结构如下：
```
{
	value:0,
	otherValue:0
}
```
编译后页面如下：

![](http://7xtbg7.com2.z0.glb.clouddn.com/redux2-1)

### conbineReducers－解决属性冲突

在同一个reducer中，修改属性名比较容易，比如上文中，我们用不同的属性名value和otherValue避免组件的冲突。但是，项目中通常存在多个组件，这些组件相关的reducer写在不同的方法中，这种情况容易出现属性名冲突，且难以修改。比如，现在我们再引入第三个Counter组件，且该组件对应另一个reducer方法，也同样用value属性名来保存值，代码如下：

```
// reducer.js
export function counterReducer(state = { value:0, otherValue:0}, action){
  state.value =  state.value || 0;
  switch (action.type) {
    case 'INCREMENT':
      state.value++;
      return state;
    case 'OTHER_INCREMENT':
      state.otherValue++;
      return state;
    default:
      return state;
  }
}

export function secondReducer(state={ value:0 }, action){
  switch (action.type) {
    case 'DOUBLE_INCREMENT':
      state.value= state.value+2;
      return state;
    default:
      return state;
  }
}
```

redux提供了conbineReducers方法来应对多个reducer合并成一个，从而解决属性名冲突的情况，用法如下：

```
import {createStore, combineReducers} from 'redux'
import {counterReducer, secondReducer} from './reducer.js'

var reducers=combineReducers({counterReducer,secondReducer})

const store = createStore(reducers)
```

conbineReducers在全局对象中添加了与方法名对应的属性，通过这种方法解决了冲突问题。此时全局对象state的解构如下：
```
{
	counterReducer: { value:0, otherValue:0},
	secondReducer: { value:0 }
}
```

在这种情况下，组件初始化时传入的值也要加方法前缀，比如state.counterReducer.value。因此引用组件的入口文件index.js也要做相应调整，代码如下：

```
ReactDOM.render(
    <div>
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
    </div>
    ,
    document.getElementById('demo2')
  )
```

### 结语
本文详细解释了当所有组件的state都放在一个全局变量时不可避免的属性名冲突问题，以及如何通过redux提供的conbineReducers方法解决此问题。

代码示例可在[此处下载](https://github.com/twomeetings/reduxExample)，在目录demo2中可找到本文示例。