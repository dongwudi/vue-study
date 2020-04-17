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
        // 初始化 router实例的init方法执行
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
      // 销毁
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
