## vue-router

`examples` 为相关示例代码

## 插件注入

```
Vue.use(VueRouter)
```

在 `src/index.js` 中暴露了 `VueRouter` 对象,包含了静态 `install` 方法:

```
import { install } from './install'
// ...
import { inBrowser } from './util/dom'
// ...

export default class VueRouter {
  // ...
}

// 赋值 install
VueRouter.install = install

// 在浏览器环境且存在 window.Vue 就自动注入插件
if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter)
}
```

`src/install.js`:

```
import View from './components/view'
import Link from './components/link'

export let _Vue

export function install (Vue) {
  // 防止重复
  if (install.installed && _Vue === Vue) return
  install.installed = true

  // 赋值私有 Vue 引用
  _Vue = Vue

  // 判断是否存在
  const isDef = v => v !== undefined

  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }

  // beforeCreate destroyed mixin
  Vue.mixin({
    beforeCreate () {
      // 判断是否有 router
      if (isDef(this.$options.router)) {
        this._routerRoot = this
        this._router = this.$options.router
        // 初始化 --> VueRouter.init()
        this._router.init(this)
        // 响应式 _route 对象 --> this._router.history.current
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        // 不存在, 即除根实例以外的逻辑
        // Vue组件生成由上到下, 则所有组件实例的 _routerRoot 都会指向根实例的 _routerRoot, 即根实例
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      // 注册实例
      registerInstance(this, this)
    },
    destroyed () {
      // 注销
      registerInstance(this)
    }
  })

  // 定义只读 $router 属性
  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })

  // 定义只读 $route 属性
  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })

  // 定义 RouterView RouterLink 两个全局组件
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

  // 定义合并策略
  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}
```

`install` 主要做了以下事情：

1. 通过全局 `mixin` 在 `beforeCreate`, `destroyed` 进行实例属性的添加和注册,以及销毁。
2. 定义 `_router`, `_route` 只读属性
3. 注册全局组件 `RouterView`, `RouterLink`

## VueRouter

```
  constructor (options: RouterOptions = {}) {
    // 根vue实例
    this.app = null
    // 持有 $options.router 属性的vue实例
    this.apps = []
    // 传入的路由配置
    this.options = options
    this.beforeHooks = []
    this.resolveHooks = []
    this.afterHooks = []
    // 根据传入的 routes 创建 match 匹配对象
    this.matcher = createMatcher(options.routes || [], this)

    // 默认 `hash`
    let mode = options.mode || 'hash'
    // 是否降级处理
    this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false
    if (this.fallback) {
      mode = 'hash'
    }
    // nodejs环境
    if (!inBrowser) {
      mode = 'abstract'
    }
    this.mode = mode

    // 根据不同的mode实例化具体的 history
    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base)
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          assert(false, `invalid mode: ${mode}`)
        }
    }
  }
```

定义了一些属性和方法，并且根据不同的`mode`实例化具体的`history`。之前代码在 Vue 组件`beforeCreate`混入的时候，会执行 `router`实例的`init`方法。

```
  init (app: any /* Vue component instance */) {
    process.env.NODE_ENV !== 'production' && assert(
      install.installed,
      `not installed. Make sure to call \`Vue.use(VueRouter)\` ` +
      `before creating root instance.`
    )

    this.apps.push(app)

    // set up app destroyed handler
    // https://github.com/vuejs/vue-router/issues/2639
    // 防止内存泄露
    app.$once('hook:destroyed', () => {
      // clean out app from this.apps array once destroyed
      const index = this.apps.indexOf(app)
      if (index > -1) this.apps.splice(index, 1)
      // ensure we still have a main app or null if no apps
      // we do not release the router so it can be reused
      if (this.app === app) this.app = this.apps[0] || null
    })

    // main app previously initialized
    // return as we don't need to set up new history listener
    // 代表已经初始化了-> 根vue
    if (this.app) {
      return
    }

    this.app = app

    const history = this.history

    // 拿到当前的 this.history，对 HTML5History， HashHistory 分别处理
    if (history instanceof HTML5History) {
      history.transitionTo(history.getCurrentLocation())
    } else if (history instanceof HashHistory) {
      const setupHashListener = () => {
        history.setupListeners()
      }
      history.transitionTo(
        history.getCurrentLocation(),
        setupHashListener,
        setupHashListener
      )
    }

    history.listen(route => {
      this.apps.forEach((app) => {
        app._route = route
      })
    })
  }
```

`init` 方法主要就是存储`this.apps this.app`,拿到当前的`history`,根据它的类型去做不同的逻辑处理。

```
    // 拿到当前的 this.history，对 HTML5History， HashHistory 分别处理
    if (history instanceof HTML5History) {
      history.transitionTo(history.getCurrentLocation())
    } else if (history instanceof HashHistory) {
      const setupHashListener = () => {
        history.setupListeners()
      }
      history.transitionTo(
        history.getCurrentLocation(),
        setupHashListener,
        setupHashListener
      )
    }
```

`transitionTo`:
```
  transitionTo (
    location: RawLocation,
    onComplete?: Function,
    onAbort?: Function
  ) {
    // 得到匹配的route对象
    const route = this.router.match(location, this.current)
    this.confirmTransition(
      route,
      () => {
        // 更新当前route对象
        this.updateRoute(route)
        onComplete && onComplete(route)
        // 更新url地址
        this.ensureURL()

        // fire ready cbs once
        if (!this.ready) {
          this.ready = true
          this.readyCbs.forEach(cb => {
            cb(route)
          })
        }
      },
      err => {
        if (onAbort) {
          onAbort(err)
        }
        if (err && !this.ready) {
          this.ready = true
          this.readyErrorCbs.forEach(cb => {
            cb(err)
          })
        }
      }
    )
  }
```
注意到：

```
  // 得到匹配的route对象
  const route = this.router.match(location, this.current)
```
`this.router.match` 相关代码为：    
`./src/history/base.js`
```
  constructor (router: Router, base: ?string) {
    this.router = router
  }
```
然后又回到了`VueRouter`构造函数中：
```
    // 根据不同的mode实例化具体的 history
    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base)
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          assert(false, `invalid mode: ${mode}`)
        }
    }
```
其实也就是最后调用的是`VueRouter`实例的`match`方法：
```
  match (
    raw: RawLocation,
    current?: Route,
    redirectedFrom?: Location
  ): Route {
    return this.matcher.match(raw, current, redirectedFrom)
  }
```

`this.matcher` 方法最后返回了一个对象

```
  return {
    match,
    addRoutes
  }
```

`match`方法可以匹配路径，`addRoutes`会执行`createRouteMap`来生成路由映射表。