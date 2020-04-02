---
title: "Redux系列之四 － 粘合剂react-redux组件（上）"
date: '2017-03-02'
---

前三篇介绍了redux的用法，虽然示例代码中使用了react框架来呈现数据，但实际上两者之间并未有太多交集，而且为了结合redux框架，react的写法也不得不调整，反而造成了不便。这个问题产生的原因是少用了一个核心组件react-redux，它是react和redux框架的粘合剂。

react-redux组件的用法很简单，只有两个部分：一个是Provider组件，另一个是connect方法，本文重点讲解Provider组件。
### Provider组件

在前三篇的示例中，示例代码中使用了自定义的Counter组件，可这种组件是呈现组件，没有state相关的逻辑。然而有时，组件需要在内部操作state，无法通过props属性暴露给调用方，这就需要在redux框架下编写容器组件。

> 关于呈现组件和容器组件的概念可参考[React系列文章之六](/20160316-react-part-6)

由于redux将所有组件的state都存放在全局变量Store中，因此，在Rudux框架下的容器组件写法也略有不同，需要将Store通过属性props来传入。

在[React系列之二](/20160316-react-part-6)的示例中有一个下拉框，通过state保存用户对颜色的选择，代码如下：

```
var Picker= React.createClass({
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
```

Store可以通过props传入到容器组件内，但是组件有时还会包含子组件，一旦层级过深，传递Store的写法会变的难以维护。因此，react-redux组件提供了一个方法，只需在外侧用Provider组件包裹住，就可以将store传递下去，写法如下：

```
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import { createStore} from 'redux'
import Picker from './picker'
import Reducer from './reducer'

const store = createStore(Reducer)
ReactDOM.render(
  <Provider store={store}>
    <Picker />
  </Provider>,
  document.getElementById('demo4')
)
```

被Provider组件包裹后，内部的所有组件都可以通过this.context.store访问到全局变量Store，上面的Picker组件的render方法改动如下：

```
  render(){
    var { store }= this.context;
    return(
      <select value={store.getState().selectedValue} onChange={this._handleChange.bind(this)}>
        <option value=''></option>
        <option value='red'>Red</option>
        <option value='blue'>Blue</option>
      </select>
    )
  }
```

当需要发送Action指令来改变state状态时，可以直接调用store的实例，执行dispatch方法。

```
_handleChange(event){
    var { store }= this.context;
    store.dispatch({type:'SELECTCHANGE', value: event.target.value})
  }
```

### 注意

想要在组件中通过this.context.store读取到值，除了将其包裹在Provider组件中之外，还要添加一个属性contextTypes，在本例中，写法如下。

```
Picker.contextTypes = { store: React.PropTypes.object };
```

Provider很少单独使用，当Provider和connect方法一起使用时，则不必添加contextTypes。

### 结语
在Redux架构下，必需将全局变量Store传入组件内部，才能操作state，当组件内嵌的子组件层数过多时，这种写法难以维护。通过react-redux提供的Provider组件包裹的方式，将Store传入各个组件中。

本系列示例可在[此处下载](https://github.com/twomeetings/reduxExample)，本文的代码可在目录demo4中查询。


