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

在上边代码中，调用`Store`构造函数创建`store`实例。 这里主要是创建一些 `store` 实例内部的属性，`module`注册以及 `mutations`, `actions`, `getters`的注册和通过 `store._vm` 观测 `state, getters` 的变化。下边分析一下`store.js` 中相对核心的代码：

#### this.\_modules

如果我们在实例化`store`对象时，添加了 `mod1` 模块

```
  modules: {
    mod1: {}
  }
```

```
this._modules = new ModuleCollection(options)
```

![_modules](https://upload-images.jianshu.io/upload_images/9279065-631c36378b5b353a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
现在根据生成的属性对象，来进行代码学习 `src/module-collection.js`:

关键代码：

```
 constructor (rawRootModule) {
    this.register([], rawRootModule, false)
  }

  register (path, rawModule, runtime = true) {
    // 实例化一个module
    const newModule = new Module(rawModule, runtime)
    if (path.length === 0) {
      // 如果是根module就绑定到root属性
      this.root = newModule
    } else {
      // 子module添加到父module的 _children属性上
      const parent = this.get(path.slice(0, -1))
      parent.addChild(path[path.length - 1], newModule)
    }

    // register nested modules
    // 注册嵌套模块(modules属性存在)
    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(path.concat(key), rawChildModule, runtime)
      })
    }
  }
```

第一次调用，`path = []`, 进入`path.length === 0` 的逻辑中，实例化 `Module` 赋值给 `this.root`(\_modules.root)。先不分析 `else` 的逻辑，先看下 `Module` 构造函数做了什么？

```
  constructor (rawModule, runtime) {
    // 初始化时runtime为false
    this.runtime = runtime
    // Store some children item
    // _children：保存子模块
    this._children = Object.create(null)
    // Store the origin module object which passed by programmer
    // 保存原始对象,传入的，也就是父级Module
    this._rawModule = rawModule
    const rawState = rawModule.state

    // Store the origin module's state
    // 保存state ，是函数就执行
    this.state = (typeof rawState === 'function' ? rawState() : rawState) || {}
  }
```

下边回到刚才`src/module-collection.js`, 执行到`options`含有 modules 属性时，执行以下操作来递归注册模块

```
   if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(path.concat(key), rawChildModule, runtime)
      })
    }
```

这时就不符合`path.length === 0`，进入 else 逻辑：

```
     // 子module添加到父module的 _children属性上
      const parent = this.get(path.slice(0, -1))
      parent.addChild(path[path.length - 1], newModule)
```

#### installModule()

```
installModule(this, state, [], this._modules.root)
```

```
function installModule (store, rootState, path, module, hot) {
  // 是否为根Module
  const isRoot = !path.length
  // 获取module的完整Namespace   （传入完整的路径） ["cart", "cart_child"]  --> 获得 cart/cart_child/
  const namespace = store._modules.getNamespace(path)

  // 如果namespaced为true则在_modulesNamespaceMap中注册
  if (module.namespaced) {
    if (store._modulesNamespaceMap[namespace] && process.env.NODE_ENV !== 'production') {
      console.error(`[vuex] duplicate namespace ${namespace} for the namespaced module ${path.join('/')}`)
    }
    store._modulesNamespaceMap[namespace] = module
  }

  // set state
  // 非根设置state
  if (!isRoot && !hot) {
    // 根据path获取父state
    const parentState = getNestedState(rootState, path.slice(0, -1))
    // 当前module
    const moduleName = path[path.length - 1]
    store._withCommit(() => {
      // 通过Vue.set将state设置为响应式
      Vue.set(parentState, moduleName, module.state)
    })
  }

  // 设置module上下文
  // store cart/ ["cart"]
  const local = module.context = makeLocalContext(store, namespace, path)

  // 遍历注册mutation
  module.forEachMutation((mutation, key) => {
    // cart/pushProductToCart
    const namespacedType = namespace + key
    registerMutation(store, namespacedType, mutation, local)
  })

  // 遍历注册action
  module.forEachAction((action, key) => {
    // {root: true} -> 在带命名空间的模块注册全局 action
    const type = action.root ? key : namespace + key
    const handler = action.handler || action
    registerAction(store, type, handler, local)
  })

  // 遍历注册getter
  module.forEachGetter((getter, key) => {
    const namespacedType = namespace + key
    registerGetter(store, namespacedType, getter, local)
  })

  // 注册子module
  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child, hot)
  })
}
```

这里主要就是注册`mutation action getter`, 根据`_modules`生成`namespace`，分别注册`state mutation action getter`，最后递归注册子模块。  
先看 `makeLocalContext` ，它根据 `namespace` 创建局部 `context`，分别注册`state mutation action getter`。其实这里`namespace: true` 会让`state mutation action getter`都拥有自己的全名。这样可以减少命名冲突。

> 注意：`module.context`属性,辅助函数方法中会使用到

在进行子`module`的注册时，是遍历`module._children`属性。会执行

```
  // 非根设置state
  if (!isRoot && !hot) {
    // 根据path获取父state
    const parentState = getNestedState(rootState, path.slice(0, -1))
    // 当前module
    const moduleName = path[path.length - 1]
    store._withCommit(() => {
      // 通过Vue.set将state设置为响应式
      Vue.set(parentState, moduleName, module.state)
    })
  }
```

![state](https://upload-images.jianshu.io/upload_images/9279065-ff8485be6d939b6d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
再看下 `installModule`过程中的其它 3 个重要方法：`registerMutation、registerAction 和 registerGetter`:

##### registerMutation

```
// 处理mutation === handler
function registerMutation (store, type, handler, local) {
  // store._mutations[type]判断，不存在就赋值空数组
  const entry = store._mutations[type] || (store._mutations[type] = [])
  // 将mutation的包装函数push到对应的mutation对象数组
  entry.push(function wrappedMutationHandler (payload) {
    // 调用我们设置的mutation的回调函数 --> commit触发
    handler.call(store, local.state, payload)
  })
}
```

`mutation`的回调函数的调用是通过`commit`触发的。这里需要通过`commit`函数进行了解：

```
  commit (_type, _payload, _options) {
    // check object-style commit
    const {
      type,
      payload,
      options
    } = unifyObjectStyle(_type, _payload, _options)

    const mutation = { type, payload }
    const entry = this._mutations[type]
    if (!entry) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[vuex] unknown mutation type: ${type}`)
      }
      return
    }

    // 遍历这个 type 对应的 mutation 对象数组，执行 handler(payload)
    this._withCommit(() => {
      entry.forEach(function commitIterator (handler) {
        handler(payload)
      })
    })

    // 通知所有订阅者 (_subscribers: 订阅（注册监听） store 的 mutation)
    this._subscribers.forEach(sub => sub(mutation, this.state))

    if (
      process.env.NODE_ENV !== 'production' &&
      options && options.silent
    ) {
      console.warn(
        `[vuex] mutation type: ${type}. Silent option has been removed. ` +
        'Use the filter functionality in the vue-devtools'
      )
    }
  }
```

commit 支持 3 个参数，type 表示 mutation 的类型，payload 表示额外的参数，options 表示一些配置。commit 根据 type 去查找对应的 mutation，如果找不到，则输出一条错误信息，否则遍历这个 type 对应的 mutation 对象数组，执行 handler(payload) 方法，这个方法就是之前定义的 `wrappedMutationHandler`，执行它就相当于执行了 registerMutation 注册的回调函数。注意这里我们依然使用了 this.\_withCommit 的方法提交 mutation。

##### registerAction

```
// 处理action
function registerAction (store, type, handler, local) {
  const entry = store._actions[type] || (store._actions[type] = [])
  entry.push(function wrappedActionHandler (payload, cb) {
    let res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb)
    // 返回值如果不是Promise对象就包装成一个Promise对象
    if (!isPromise(res)) {
      res = Promise.resolve(res)
    }
    if (store._devtoolHook) {
      return res.catch(err => {
        store._devtoolHook.emit('vuex:error', err)
        throw err
      })
    } else {
      return res
    }
  })
}
```

和`mutation`类似，`action`的注册比`mutation`多了一步，将函数进行了`Promise`包装，这也是为什么`action`可以异步的原因。`action`是通过`dispatch`触发的。

##### registerGetter

```
function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[vuex] duplicate getter key: ${type}`)
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  }
}
```

这里保存 getter 到`store._wrappedGetters`上。

#### resetStoreVM

```
// 设置一个新的vue实例，用来保存state和getter
function resetStoreVM (store, state, hot) {
  // 保存之前的vm对象
  const oldVm = store._vm

  // bind store public getters
  store.getters = {}
  const wrappedGetters = store._wrappedGetters
  const computed = {}
  // this.$store.getters.xxxgetters -> store._vm[xxxgetters]
  forEachValue(wrappedGetters, (fn, key) => {
    // use computed to leverage its lazy-caching mechanism
    // direct inline function use will lead to closure preserving oldVm.
    // using partial to return function with only arguments preserved in closure enviroment.
    computed[key] = partial(fn, store)
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true // for local getters
    })
  })

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  const silent = Vue.config.silent
  // 在new一个Vue实例的过程中不会报出一切警告
  Vue.config.silent = true
  // new一个vue实例, 响应式 state->state, computed->getter
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
  Vue.config.silent = silent

  // enable strict mode for new vm
  // 保证修改store只能通过mutation
  if (store.strict) {
    enableStrictMode(store)
  }

  // 函数每次都会创建新的 Vue 实例并赋值到 store._vm
  // 这里将旧的 _vm 对象的状态设置为 null，并调用 $destroy 方法销毁这个旧的 _vm 对象
  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(() => {
        oldVm._data.$$state = null
      })
    }
    Vue.nextTick(() => oldVm.$destroy())
  }
}
```

利用 store.\_vm 保存了一个 Vue 实例，通过 Vue 实例来保留 state 树，以及用计算属性的方式存储了 store 的 getters。

## 辅助函数

#### mapState

官方示例：

```
computed: mapState({
    count: state => state.count,
    countAlias: 'count',
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
// 当映射的计算属性的名称与 state 的子节点名称相同时,可以传递数组
computed: mapState(['count'])
// 命名空间
...mapState({
  a: state => state.some.nested.module.a,
  b: state => state.some.nested.module.b
})
...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  })
```

##### normalizeNamespace

```
function normalizeNamespace (fn) {
  return (namespace, map) => {
    if (typeof namespace !== 'string') {
      map = namespace
      namespace = ''
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/'
    }
    return fn(namespace, map)
  }
}
```

`mapState`首先通过`normalizeNamespace`对传入的参数进行有没有 namespace 的处理，而后执行 fn(namespace, map)。

```
export const mapMutations = normalizeNamespace((namespace, mutations) => {
  const res = {}
  normalizeMap(mutations).forEach(({ key, val }) => {
    res[key] = function mappedMutation (...args) {
      // Get the commit method from store
      let commit = this.$store.commit
      if (namespace) {
        const module = getModuleByNamespace(this.$store, 'mapMutations', namespace)
        if (!module) {
          return
        }
        commit = module.context.commit
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    }
  })
  return res
})
```

这里通过`normalizeMap`将传入的数组或者对象这两种方式进行处理：

```
/**
 * Normalize the map
 * normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
 * normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
 * @param {Array|Object} map
 * @return {Object}
 */
// map 处理
function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key] }))
}
```

mapState 的作用是把全局的 state 和 getters 映射到当前组件的 computed 计算属性中，Vue 中 每个计算属性都是一个函数， mapState 函数的返回值是这样一个对象:

```
computed: {
    count() {
	      return this.$store.state.count
        }
}
```
