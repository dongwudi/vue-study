import Vue from 'vue/dist/vue.esm';
import Router from 'vue-router';
Vue.use(Router);

// 1.引入路由组件
import main from '../components/main';
import slider from '../components/slider';
import fault from '../components/fault';

// 2.定义路由
// 定义路由的时候可以配置 meta 字段：
const routes = [
  {
    path: '/slider',
    component: main,
    children: [
      {
        path: 'child',
        component: slider,
        meta : { requiresAuth: true }
        // /slider/child 这个 URL 将会匹配父路由记录以及子路由记录
      }
    ]
  }
]

// 3.创建router实例
const router = new Router({
  routes
})

export default router;
