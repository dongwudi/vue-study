## Vuex 源码学习

## 源码目录

```
src:.
│  helpers.js
│  index.esm.js
│  index.js
│  mixin.js
│  store.js
│  util.js
│
├─module
│      module-collection.js
│      module.js
│
└─plugins
        devtool.js
        logger.js
```

Vuex 核心 API：

```
// 初始化实例
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules,
  plugins
})

const vm = new Vue({
  store, // inject store to all children
  el: '#app',
  render: h => h(App)
})

// 实例方法
commit dispatch

// 辅助函数
mapState mapGetters mapActions mapMutations
```

## 插件安装

```
import Vuex from 'vuex'

Vue.use(Vuex)
```

引入了 `src/index.js` 暴露的对象:

```
export default {
  Store,
  install,
  version: '__VERSION__',
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
  createNamespacedHelpers
}
```

其中包含一个 `install` 方法，这也是 Vue 官方开发插件的方式。 `install` 方法位于 `src/store.js` 中:

```
export function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}
```

这里将传入的 `Vue`（\_Vue） 赋值给 `Vue`，便于后续的使用。然后调用 `src/mixin.js` 中暴露的方法 `applyMinxin(Vue)` ，主要作用就是混入 `beforeCreate` 钩子函数，保证每个组件的 `this.$store` 都是初始化实例的 `store`。

```
export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])

  // Vue 2.x版本直接通过Vue.mixin混淆执行vuexInit方法
  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // 1.x版本覆写原_init 方法
    // 加入vuexInit方法
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex 初始化钩子
   */

  function vuexInit () {
    const options = this.$options
    // store injection
    // options.store 代表根组件
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
        // 在每个子组件上面挂载store的引用
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}

```

## Store 构造函数

```
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules,
  plugins
})

const vm = new Vue({
  store, // inject store to all children
  el: '#app',
  render: h => h(App)
})
```

在上边代码中，调用`Store`构造函数创建`store`实例。 这里主要是创建一些 `store` 实例内部的属性，`module`注册以及 `mutations`, `actions`, `getters`的注册和通过 `store._vm` 观测 `state, getters` 的变化。


```
this._modules = new ModuleCollection(options)
```

