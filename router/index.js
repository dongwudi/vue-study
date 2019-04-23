import Vue from 'vue/dist/vue.esm';
import Router from 'vue-router';
Vue.use(Router);

// 1.引入路由组件
import bar from '../components/bar';
import foo from '../components/foo';

// 2.定义路由
const routes = [
  { path: '/foo', component: foo },
  { path: '/bar', component: bar }
]

// 3.创建router实例
const router = new Router({
  routes
})

export default router;
