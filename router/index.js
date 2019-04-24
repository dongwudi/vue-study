import Vue from 'vue/dist/vue.esm';
import Router from 'vue-router';
Vue.use(Router);

// 1.引入路由组件
import user from '../components/user';
import register from '../components/register'

// 2.定义路由
const routes = [
  {
    name: 'user',
    path:'/user/:id',
    component: user
  }
]

// 3.创建router实例
const router = new Router({
  routes
})

export default router;
