import Vue from 'vue/dist/vue.esm';
import router from '../router';

const app = new Vue({
  el: '#app',
  router,
  data: {
    
  },
  mounted() {
    // console.log(this.$route)
    // console.log(this.$router)

    // router.push('home')
    // router.push({path: 'home'})
    //命名的路由 --> 
    // router.push({ name: 'user', params: { id: '123' }})

    // 带查询参数，变成 /register?plan=private
    // router.push({ path: 'register', query: { plan: 'private' }})

    // 如果提供了 path，params 会被忽略，上述例子中的 query 并不属于这种情况
    // 同样适用于router-link 的 to属性
    const id = '123'
    // router.push({ name: 'user', params: { id }}) // -> /user/123
    // router.push({ path: `/user/${id}` }) // -> /user/123
    // 这里的 params 不生效
    // router.push({ path: '/user', params: { id }}) // -> /user


    // 在 router.push 或 router.replace 中提供 onComplete 和 onAbort 回调作为第二个和第三个参数
    // onComplete/onAbort 导航成功完成/终止后调用
    // router.push({ path: `/user/${id}` },()=>{
    //   console.log(this.$route)
    // })

    // 如果目的地和当前路由相同，只有参数发生了改变 
    // (比如从一个用户资料到另一个 /users/1 -> /users/2)，
    // 你需要使用 beforeRouteUpdate 来响应这个变化 (比如抓取用户信息)。

    // router.replace(location, onComplete?, onAbort?)
    // 它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录
    router.replace({ path: `/user/${id}` }) 

    // router.go(n)
    
  },
});

window.app = app;
