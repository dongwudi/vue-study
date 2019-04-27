import Vue from 'vue/dist/vue.esm';
import router from '../router';

const app = new Vue({
  el: '#app',
  router,
  data: {
    
  },
  mounted() {
    console.log(this.$route)
    console.log(this.$router)
  },
});

// 全局前置守卫 beforeEach
// router.beforeEach ((to, from, next) => {
//   // console.log(to)
//   // console.log(from)
//   next()
//   // next : function
//   // next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed (确认的)。

//   // next(false): 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。

//   // next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。
//   // 你可以向 next 传递任意位置对象，且允许设置诸如 replace: true、name: 'home' 之类的选项
//   // 以及任何用在 router-link 的 to prop 或 router.push 中的选项。

//   // next(error): (2.4.0+) 如果传入 next 的参数是一个 Error 实例，则导航会被终止且该错误会被传递给 router.onError() 注册过的回调。
// }) 

// 全局解析守卫
// router.beforeResolve  这和 router.beforeEach 类似，区别是在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用
// router.beforeResolve ((to, from, next) => {
//   console.log(to)
//   console.log(from)
//   next()
// }) 

//全局后置钩子 这些钩子不会接受 next 函数也不会改变导航本身
// router.afterEach((to, from) => {
//   console.log(to)
//   console.log(from)
// })




window.app = app;
