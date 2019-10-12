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
   * Vuex init hook, injected into each instances init hooks list.
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
        // 在每个子组件上面挂载store的引用，保证每一个组件中this.$store 都访问的是全局的store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}
