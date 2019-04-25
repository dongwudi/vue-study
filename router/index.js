import Vue from 'vue/dist/vue.esm';
import Router from 'vue-router';
Vue.use(Router);

// 1.引入路由组件
import main from '../components/main';
import slider from '../components/slider';
import fault from '../components/fault';

// 2.定义路由
//注意：视图组件是components
const routes = [
  {
    path: '/',
    component: main
  },
  {
    path: '/slider',
    component: slider
  },
  // {
  //   name: 'foo',
  //   path: '/other/:id',
  //   component: fault
  // },
  //1.
  // {
  //   path: '/child',
  //   redirect: '/other'
  // }
  //2.重定向到命名路由
  // { path: '/child', 
  //   redirect: 
  //   { name: 'foo' }
  // }
  // 3.甚至是一个方法，动态返回重定向目标
    // { path: '/child', redirect: to => {
    //   // 方法接收 目标路由 作为参数
    //   // return 重定向的 字符串路径/路径对象
    //   console.log(to);
    //   // return '/other';
    //   return {
    //     name: 'foo'
    //   }
    // }}
    // 4.参数
    // {
    //   path: '/child/:id',
    //   redirect: '/other/:id'
    // }

    // 别名 /a 的别名是 /b，意味着，当用户访问 /b 时，URL 会保持为 /b，但是路由匹配则为 /a
    {
      path: '/child/:id',
      component: fault,
      alias: '/alias/:id'
    },


]

// 3.创建router实例
const router = new Router({
  routes
})

export default router;
