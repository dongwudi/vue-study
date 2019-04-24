import NavBar from './NavBar';
export default {
    template: `
    <div>
        <h1>User Settings</h1>
        <NavBar/>
        <router-view/>
        <router-view name="post"/>
    </div>
    `,
    components:{
        NavBar
    }
}