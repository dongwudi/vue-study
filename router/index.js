import Vue from 'vue/dist/vue.esm';
import Router from 'vue-router';
Vue.use(Router);

// 1.引入路由组件
import bar from '../components/bar';
import foo from '../components/foo';
import user from '../components/user';
import error from '../components/error';

// 2.定义路由
// 同一个路径可以匹配多个路由，此时，匹配的优先级就按照路由的定义顺序：谁先定义的，谁的优先级就最高
const routes = [
  { path: '/foo', component: foo },
  { path: '/bar', component: bar },
  // 一个“路径参数”使用冒号 : 标记。当匹配到一个路由时，参数值会被设置到 this.$route.params，可以在每个组件内使用
  //可以设置多段路径参数  /user/:id/post/:post_id --> user/bar/post/s
  // 除了$route.params外，$route对象还提供了其他信息：$route.query (url带有查询参数时) ，$route.hash 等
  // ?sea=ans&ant=en -->  $route.query: {sea: "ans", ant: "en"}
  // /user/bar/#hash123 --> $route.hash: "#hash123"
  {
    path:'/user/:id/post/:post_id',
    component: user
  },
  {
    path:'/user/:id',
    component: user
  },
  //常规参数只会匹配被 / 分隔的 URL 片段中的字符。如果想匹配任意路径，我们可以使用通配符 (*)
  // 当使用通配符路由时，请确保路由的顺序是正确的，也就是说含有通配符的路由应该放在最后
  {
    // 会匹配以 `/user-` 开头的任意路径
    path: '/user-*',
    component: user
  },
  // 路由 { path: '*' } 通常用于客户端 404 错误
  {
    // 会匹配所有路径
    path: '*',
    component: error
  },
  // 高级匹配模式
  // :id 命名参数（默认参与下一次匹配 /:id/:nid）
  // ? 可选
  // * 匹配任意项


]

// 3.创建router实例
const router = new Router({
  routes
})

export default router;
