import Vue from 'vue/dist/vue.esm';
import Router from 'vue-router';
Vue.use(Router);

// 1.引入路由组件
import main from '../components/main';
import slider from '../components/slider';
import fault from '../components/fault';
import usersettings from '../components/UserSettings';
import useremal from '../components/UserEmailSubscriptions'
import userprofile from '../components/UserProfile'
import userpropost from '../components/UserProfilepost'

// 2.定义路由
//注意：视图组件是components
const routes = [
  // {
  //   path: '/',
  //   components: {
  //     default: fault,
  //     main: main,
  //     slider: slider
  //   }
  // },
  {
    path: '/settings',
    component: usersettings,
    children: [
      {
        path: 'email',
        component: useremal
      },
      {
        path: 'profile',
        components: {
          default: userprofile,
          post: userpropost
        }
      }
    ]
  }
]

// 3.创建router实例
const router = new Router({
  routes
})

export default router;
