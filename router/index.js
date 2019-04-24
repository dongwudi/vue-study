import Vue from 'vue/dist/vue.esm';
import Router from 'vue-router';
Vue.use(Router);

// 1.引入路由组件
import user from '../components/user';
import UserProfile from '../components/UserProfile';
import UserHome from '../components/UserHome';

// logding
import LoadingComponent from '../components/load/LoadingComponent';
import ErrorComponent from '../components/load/ErrorComponent';

// 2.定义路由
const routes = [
  {
    path:'/user/:id',
    component: user,
    children: [
      // 当 /user/:id 匹配成功，
      // UserHome 会被渲染在 User 的 <router-view> 中
      { 
        path: '',
        component: UserHome
      },
      {
        // 当 /user/:id/profile 匹配成功，
        // UserProfile 会被渲染在 User 的 <router-view> 中
        path: 'profile',
        component: UserProfile
      },
      {
        // 当 /user/:id/posts 匹配成功
        // UserPosts 会被渲染在 User 的 <router-view> 中
        path: 'posts',
        component: () => import('../components/UserPosts')
      },
      //加载动画，可实现效果
      {
        path: 'load', 
        component : (resolve) => {
          document.getElementById('load').innerHTML = 'loading'
          require(['../components/UserLoad'],
            (component) => {
              resolve(component)
              document.getElementById('load').innerHTML = 'over'
            }
          )
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
