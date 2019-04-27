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

let auth =  {
  loggedIn () {
    return false
  }
}
//全局导航守卫中检查元字段
// /slider/child 这个 URL 将会匹配父路由记录以及子路由记录
router.beforeEach((to, from, next) => {
  console.log(to.matched)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

window.app = app;
