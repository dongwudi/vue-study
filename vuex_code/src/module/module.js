import { forEachValue } from '../util'

// Base data struct for store's module, package with some attribute and method
// module
export default class Module {
  constructor (rawModule, runtime) {
    // 初始化时runtime为false
    this.runtime = runtime
    // Store some children item
    // _children：保存子模块
    this._children = Object.create(null)
    // Store the origin module object which passed by programmer
    // 保存原始对象
    this._rawModule = rawModule
    const rawState = rawModule.state

    // Store the origin module's state
    // 保存state ，是函数就执行
    this.state = (typeof rawState === 'function' ? rawState() : rawState) || {}
  }

  // 通过es6 get关键字 对namespaced设置取值函数
  get namespaced () {
    return !!this._rawModule.namespaced
  }

  // 添加子模块
  addChild (key, module) {
    this._children[key] = module
  }

  removeChild (key) {
    delete this._children[key]
  }

  getChild (key) {
    return this._children[key]
  }

  update (rawModule) {
    this._rawModule.namespaced = rawModule.namespaced
    if (rawModule.actions) {
      this._rawModule.actions = rawModule.actions
    }
    if (rawModule.mutations) {
      this._rawModule.mutations = rawModule.mutations
    }
    if (rawModule.getters) {
      this._rawModule.getters = rawModule.getters
    }
  }

  forEachChild (fn) {
    forEachValue(this._children, fn)
  }

  forEachGetter (fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn)
    }
  }

  forEachAction (fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn)
    }
  }

  forEachMutation (fn) {
    // 存在mutations 就遍历
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn)
    }
  }
}
