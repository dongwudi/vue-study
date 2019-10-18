import applyMixin from './mixin'
import devtoolPlugin from './plugins/devtool'
import ModuleCollection from './module/module-collection'
import { forEachValue, isObject, isPromise, assert, partial } from './util'

let Vue // bind on install

export class Store {
  constructor (options = {}) {
    // Auto install if it is not done yet and `window` has `Vue`.
    // To allow users to avoid auto-installation in some cases,
    // this code should be placed here. See #731
    // 浏览器环境下，Vue不存在即未安装，而window.Vue存在则自动安装
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      install(window.Vue)
    }

    // 断言提示
    if (process.env.NODE_ENV !== 'production') {
      assert(Vue, `must call Vue.use(Vuex) before creating a store instance.`)
      assert(typeof Promise !== 'undefined', `vuex requires a Promise polyfill in this browser.`)
      assert(this instanceof Store, `store must be called with the new operator.`)
    }

    const {
      // 应用的插件列表，接收store作为唯一参数
      plugins = [],
      // 是否开启严格模式，true：无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误
      strict = false
    } = options

    // store internal state
    // 存储内部状态
    this._committing = false // 标志提交状态，保证对Vuex中state的修改只能在mutation的回调函数中，而不能在外部随意修改state
    this._actions = Object.create(null) // 存储actions
    this._actionSubscribers = [] // 存储actions 订阅者
    this._mutations = Object.create(null) // 存储mutations
    this._wrappedGetters = Object.create(null) // 存储getters
    this._modules = new ModuleCollection(options)// modules收集 -> ModuleCollection {root: Module}
    this._modulesNamespaceMap = Object.create(null) // 根据namespace存储module
    this._subscribers = [] // 订阅者
    this._watcherVM = new Vue() // Vue实例 => 实现watch

    // bind commit and dispatch to self
    // 将dispatch, commit绑定到Store实例自身，防止组件内部this.dispath, this.commit指向vm
    const store = this
    const { dispatch, commit } = this
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
      return commit.call(store, type, payload, options)
    }

    // strict mode
    // 严格模式
    this.strict = strict

    // 保存 state
    const state = this._modules.root.state
    // console.log(this._modules.root)

    // init root module.
    // this also recursively registers all sub-modules
    // and collects all module getters inside this._wrappedGetters
    // 初始化根module, 递归注册子module，并且收集所有getter到 this._wrappedGetters
    installModule(this, state, [], this._modules.root)

    // initialize the store vm, which is responsible for the reactivity
    // (also registers _wrappedGetters as computed properties)
    // 通过初始化 store._vm ，观测 state, getters的变化
    resetStoreVM(this, state)

    // apply plugins
    // 应用插件
    plugins.forEach(plugin => plugin(this))

    // devtoolPlugin
    const useDevtools = options.devtools !== undefined ? options.devtools : Vue.config.devtools
    if (useDevtools) {
      devtoolPlugin(this)
    }
  }

  get state () {
    return this._vm._data.$$state
  }

  set state (v) {
    if (process.env.NODE_ENV !== 'production') {
      assert(false, `use store.replaceState() to explicit replace store state.`)
    }
  }

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

  dispatch (_type, _payload) {
    // check object-style dispatch
    const {
      type,
      payload
    } = unifyObjectStyle(_type, _payload)

    const action = { type, payload }
    const entry = this._actions[type]
    if (!entry) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[vuex] unknown action type: ${type}`)
      }
      return
    }

    try {
      this._actionSubscribers
        .filter(sub => sub.before)
        .forEach(sub => sub.before(action, this.state))
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[vuex] error in before action subscribers: `)
        console.error(e)
      }
    }

    const result = entry.length > 1
      ? Promise.all(entry.map(handler => handler(payload)))
      : entry[0](payload)

    return result.then(res => {
      try {
        this._actionSubscribers
          .filter(sub => sub.after)
          .forEach(sub => sub.after(action, this.state))
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[vuex] error in after action subscribers: `)
          console.error(e)
        }
      }
      return res
    })
  }

  subscribe (fn) {
    return genericSubscribe(fn, this._subscribers)
  }

  subscribeAction (fn) {
    const subs = typeof fn === 'function' ? { before: fn } : fn
    return genericSubscribe(subs, this._actionSubscribers)
  }

  watch (getter, cb, options) {
    if (process.env.NODE_ENV !== 'production') {
      assert(typeof getter === 'function', `store.watch only accepts a function.`)
    }
    return this._watcherVM.$watch(() => getter(this.state, this.getters), cb, options)
  }

  replaceState (state) {
    this._withCommit(() => {
      this._vm._data.$$state = state
    })
  }

  registerModule (path, rawModule, options = {}) {
    if (typeof path === 'string') path = [path]

    if (process.env.NODE_ENV !== 'production') {
      assert(Array.isArray(path), `module path must be a string or an Array.`)
      assert(path.length > 0, 'cannot register the root module by using registerModule.')
    }

    this._modules.register(path, rawModule)
    installModule(this, this.state, path, this._modules.get(path), options.preserveState)
    // reset store to update getters...
    resetStoreVM(this, this.state)
  }

  unregisterModule (path) {
    if (typeof path === 'string') path = [path]

    if (process.env.NODE_ENV !== 'production') {
      assert(Array.isArray(path), `module path must be a string or an Array.`)
    }

    this._modules.unregister(path)
    this._withCommit(() => {
      const parentState = getNestedState(this.state, path.slice(0, -1))
      Vue.delete(parentState, path[path.length - 1])
    })
    resetStore(this)
  }

  hotUpdate (newOptions) {
    this._modules.update(newOptions)
    resetStore(this, true)
  }

  // 保证在同步修改 state 的过程中 this._committing 的值始终为true
  _withCommit (fn) {
    const committing = this._committing
    this._committing = true
    fn()
    this._committing = committing
  }
}

// 保存回调到 _subscribers 中,并返回解除当前函数对mutation监听的函数
function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn)
  }
  return () => {
    const i = subs.indexOf(fn)
    if (i > -1) {
      subs.splice(i, 1)
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null)
  store._mutations = Object.create(null)
  store._wrappedGetters = Object.create(null)
  store._modulesNamespaceMap = Object.create(null)
  const state = store.state
  // init all modules
  installModule(store, state, [], store._modules.root, true)
  // reset vm
  resetStoreVM(store, state, hot)
}

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

// this, state, [], this._modules.root
function installModule (store, rootState, path, module, hot) {
  // 是否为根Module
  const isRoot = !path.length
  // 获取module的完整Namespace   （传入完整的路径） ["cart", "cart_child"]  --> 获得 cart/cart_child/
  const namespace = store._modules.getNamespace(path)

  // register in namespace map
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

  // 设置module本地上下文
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

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
// 建立本地dispatch,commit,getters,state，如果没有namespace就使用根
// store cart/ ["cart"]
function makeLocalContext (store, namespace, path) {
  const noNamespace = namespace === ''

  const local = {
    // 根据namespace布尔值进行判断，false直接返回Store实例的dispatch, true 则返回前对参数进行修改
    dispatch: noNamespace ? store.dispatch : (_type, _payload, _options) => {
      // 统一格式
      const args = unifyObjectStyle(_type, _payload, _options)
      const { payload, options } = args
      let { type } = args

      // {root: true}存在，允许在命名空间模块里分发根action
      if (!options || !options.root) {
        // 加上命名空间
        type = namespace + type
        if (process.env.NODE_ENV !== 'production' && !store._actions[type]) {
          console.error(`[vuex] unknown local action type: ${args.type}, global type: ${type}`)
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : (_type, _payload, _options) => {
      const args = unifyObjectStyle(_type, _payload, _options)
      const { payload, options } = args
      let { type } = args

      if (!options || !options.root) {
        type = namespace + type
        if (process.env.NODE_ENV !== 'production' && !store._mutations[type]) {
          console.error(`[vuex] unknown local mutation type: ${args.type}, global type: ${type}`)
          return
        }
      }

      store.commit(type, payload, options)
    }
  }

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  // getters和state需要延迟处理，等数据更新后才进行计算，所以使用get，当访问的时候再进行一次计算
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? () => store.getters
        : () => makeLocalGetters(store, namespace)
    },
    state: {
      get: () => getNestedState(store.state, path)
    }
  })

  return local
}

function makeLocalGetters (store, namespace) {
  const gettersProxy = {}

  const splitPos = namespace.length
  // store.getters => cart/cartProducts
  // namespace => cart/
  Object.keys(store.getters).forEach(type => {
    // skip if the target getter is not match this namespace
    // 如果目标getter与此命名空间不匹配 直接return
    if (type.slice(0, splitPos) !== namespace) return

    // extract local getter type
    // cartProducts
    const localType = type.slice(splitPos)

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    // 加一层代理 --> 可以使得当前本地上下文访问 store实例下的getter
    // cart -> getter[cartProducts]  === store-> getter[cart/cartProducts]
    Object.defineProperty(gettersProxy, localType, {
      get: () => store.getters[type],
      enumerable: true
    })
  })

  return gettersProxy
}

// 处理mutation
function registerMutation (store, type, handler, local) {
  // store._mutations[type]判断，不存在就赋值空数组
  const entry = store._mutations[type] || (store._mutations[type] = [])
  // 将mutation的包装函数push到对应的mutation对象数组
  entry.push(function wrappedMutationHandler (payload) {
    // 调用我们设置的mutation的回调函数 --> commit触发
    handler.call(store, local.state, payload)
  })
}

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

// 处理getter
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

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, () => {
    if (process.env.NODE_ENV !== 'production') {
      assert(store._committing, `do not mutate vuex store state outside mutation handlers.`)
    }
  }, { deep: true, sync: true })
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce((state, key) => state[key], state)
    : state
}

// 统一格式
// // 以载荷形式分发
// store.dispatch('incrementAsync', {
//   amount: 10
// })
// // 以对象形式分发
// store.dispatch({
//   type: 'incrementAsync',
//   amount: 10
// })
function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload
    payload = type
    type = type.type
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof type === 'string', `expects string as the type, but found ${typeof type}.`)
  }

  return { type, payload, options }
}

// install方法，供Vue.use()使用
export function install (_Vue) {
  // 避免重复安装
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  // 保存Vue 便于使用
  Vue = _Vue
  // 在Vue生命周期钩子（1.x版本init，2.x版本beforeCreate）前插入Vuex的初始化代码vuexInit
  applyMixin(Vue)
}
