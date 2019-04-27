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
    component: fault
  },
  {
    path: '/slider/:id',
    component: main,
    //路由独享守卫
    beforeEnter: (to, from, next) => {
      // ...
    }
  }
]

// 3.创建router实例
const router = new Router({
  routes
})

export default router;
