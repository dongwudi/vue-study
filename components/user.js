export default {
  template: `
  <div>
    user:id-->{{$route.params.id}}
    <br>
    <router-link to="/user/foo/profile">Go to user profile</router-link>
    <router-link to="/user/foo/posts">Go to user posts</router-link>
    <router-link to="/user/foo/load">Go to user load</router-link>
    <router-view></router-view>
  </div>`
}