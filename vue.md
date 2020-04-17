## Vue 优化

#### v-if、v-else

- `v-if`是真正的条件渲染，也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。
- `v-show`不管初始条件是什么，元素总是被渲染，并基于 css 进行切换。
  > 因此，如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件很少改变，则使用 v-if 较好。

#### computed、watch

- `computed`是基于它们的响应式依赖进行缓存的。
- 当需要在数据变化时执行异步或开销较大的操作，或者进行一些中间操作可以选择`watch`

#### v-for

- `v-for`需为每项 item 添加`key`
- 遍历时避免同时使用`v-if`,可以使用`computed`处理后再进行`v-for`遍历渲染

#### Object.freeze()

- 如果数据不需要通过 Vue 进行劫持响应，那么就可以使用`Object.freeze()`来冻结，一旦冻结就不会再进行响应式变化

#### addEventListener、removeEventListener

- Vue 组件销毁时会解绑它的指令和事件监听，但是在 js 内使用的`addEventListener`等进行的监听是不会自动销毁的

```

created() {
  addEventListener('click', this.click, false)
},
beforeDestroy() {
  removeEventListener('click', this.click, false)
}
```

#### vue-lazyload

- 可以进行图片懒加载等 [github](https://github.com/hilongjw/vue-lazyload)

#### 路由懒加载

结合 Vue 的异步组件和 Webpack 的代码分割功能，轻松实现路由组件的懒加载

```
// vue-router

const router = new VueRouter({
  routes: [
    { path: '/foo', component: () => import('./Foo.vue)) }
  ]
})
```

#### 无限列表

对于多数据列表可以使用[vue-virtual-scroll-list](https://github.com/tangbc/vue-virtual-scroll-list)进行优化
