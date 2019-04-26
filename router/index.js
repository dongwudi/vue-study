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
  // / 对于包含命名视图的路由，你必须分别为每个命名视图添加 `props` 选项：
  {
    path: '/slider/:id',
    components: {
      default: main,
      slider: slider
    },
    props:{
      default: true,
      slider: true
    }
  },
  {
    path: '/child/:id',
    component: fault,
    //如果 props 被设置为 true，route.params 将会被设置为组件属性。
    // props: true
    //如果 props 是一个对象，它会被按原样设置为组件属性
    // props: {
    //   name: 'world'
    // },
    props: (route) => {
      let date = new Date()
      return {
        name: date.getDate() + route.params.id
      }
    }
  }
]

// 3.创建router实例
const router = new Router({
  routes
})

export default router;
