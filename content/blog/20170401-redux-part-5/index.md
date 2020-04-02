---
title: "Redux系列之五 － 粘合剂react-redux组件（下）"
date: '2017-04-01'
---

react-redux组件是React和Redux两个框架的粘合剂，它共有两个部分：Provider组件和connect方法。上篇已介绍了Provider组件，本文就来详细讲解connect方法。

### connect方法
在[React系列之七](/20160328-react-part-7)中说到了一种设计模式－呈现组件和容器组件。简单来说，呈现组件只通过传入的属性负责呈现逻辑，而跟state相关的数据改动都放到容器组件中。connect方法就是为这种模式而生，它可以通过呈现组件快速生成容器组件。

connect方法有4个参数，通常只会用到前两个，参数类型都是函数。假设现在已有一个呈现组件叫BookList, 那么connect的使用方法如下：

```
function mapStateToProps(state) {
  return { todos: state.books}
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) }
}

var container = connect(mapStateToProps, mapDispatchToProps)(BookList)
```

从方法的名字mapStateToProps和mapDispatchToProps可以看出，connect的主要功能是以下两点：
1. 从全局state中读取值，传递给呈现组件的props属性中。
2. 从让action creator和dispatch组合成简化的方法，传递给组件的props属性中。

这两点恰恰是容器组件要做的事，所以connect方法其实就是通过呈现组件快速生成容器组件的快捷方式。

> 关于action creator和dispatch的组合可参考[Redux系列之三](/20170119-redux-part-3)中，对bindActionCreators的描述。

### 用connect方法改造示例

这里我们用connect对[React系列文章之二](/20170119-react-part-2)中的例子做改造，该例中只有一个与颜色相关的下拉框，当用户选择后，state会保存选中的值。

![](http://7xtbg7.com2.z0.glb.clouddn.com/redux5-1)

首先安装react-redux组件，命令如下：

```
npm install react-redux --save
```

而前文中说到redux将所有组件的state都存入了一个全局变量中，因此redux的重要作用之一就是容器组件的简单化。

我们现在将下拉框中的state相关代码剥离出来，只留下呈现的逻辑，代码如下：

```
// picker.js
import React, { PropTypes } from 'react'

var Picker=({ value, onChange})=>{
  return(
    <div>
      <select onChange={e => onChange(e.target.value)}
              value={value} >
        <option value=''></option>
        <option value='red'>red</option>
        <option value='blue'>blue</option>
      </select>
      <p>selectedValue is: {value} </p>
    </div>
  )
}
```

代码中可以看出Picker组件接受2个属性值，没有state的操作，因为所有的state都保存在Redux中的Store里。修改Store的方法只有通过发送Action指令到Reducer中，首先，我们通过ActionCreator的方式来创建Action。

```
// actionCreator.js
function selectChangeCreator(value){
  return { type: 'SELECTCHANGE', value: value };
}

export default selectChangeCreator;
```

现在创建一个名为selectChange的reducer，代码中需要注意的是，在'SELECTCHANGE'分支下，原state并没有做修改，而是新的state被创建并返回，不改变state状态，这是redux设计中的原则，否则会出现数据更新，组件不更新的情况。

```
// reducer.js
export function selectChange(state={selectedValue:''}, action){
  switch (action.type) {
    case 'SELECTCHANGE':
      var newState = Object.assign({},
        ...state,
        {
          selectedValue: action.value
        })

      return newState;
    default:
      return state;
  }
}
```

> 关于不更新state的原则，可在[官网此处](http://redux.js.org/docs/Troubleshooting.html)查询
> 创建newState用到的"Object.assign"和扩展字符串 "...state",可在阮一峰老师的[ES6入门中](http://es6.ruanyifeng.com/)查询

#### 通过connect方法创建容器组件

准备工作都完成以后，现在我们就可以通过connect方法来创建容器组件了。首先，创建一个组件将上文所写的Picker组件包含进去，并将对应的属性值赋值给Picker组件。

```
import Picker from './picker'

class Container extends Component{
  render(){
    var {value, onChange}= this.props;
    return(
    <div>
      <Picker value={value} onChange={onChange} />
    </div>
  )
  }
}

```
代码中可以看到，value值和onChange方法都是从自身到props属性取出，它们就是通过connect方法生成的，代码如下：

```
function mapStateToProps(state){
  var { selectChange }= state
  return {
    value: selectChange.selectedValue
  }
}

function mapDispatchToProps(dispatch){
  var boundActionCreator=bindActionCreators(actionCreator, dispatch);
  return {
    onChange:(value)=>{
       boundActionCreator(value)
     }
  }
}

var PickerContainer = connect(
  mapStateToProps,
  mapDispatchToProps)(Container)

export default PickerContainer
```
代码中可以看到，mapStateToProps方法将state.selectChange.selectedValue赋值给了value。mapDispatchToProps将dispatch和actionCreator绑定后的方法赋值给了onChange，最后生成PickerContainer组件并返回。

现在只需要在入口文件(index.js)中引用此组件就可以了。

```
// index.js
import React from 'react'
import ReactDOM from 'react-dom'
import { combineReducers, createStore} from 'redux'
import { Provider } from 'react-redux'
import { selectChange } from './reducer'
import PickerContainer from './container.js'

var reducers= combineReducers({selectChange})

var store = createStore(reducers)

ReactDOM.render(
  <Provider store={store}>
    <PickerContainer />
  </Provider>,
  document.getElementById('demo5')
)
```

记得connect需要和Provider组件配合使用，因此PickerContainer必须被包裹在Provider中。

> 关于Provider的使用说明可参考[上篇](/20170302-redux-part-4)

### 结语
react-redux组件的connect方法是通过呈现组件创建容器组件的一种快捷方式，它需要和Provider组件一起使用。

本文相关的代码可在[示例代码](https://github.com/twomeetings/reduxExample)中的目录demo5中找到。



