import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';

export default {
  template: `
  <div>
    count -- {{ count }}
    <br>
    addcount -- {{addCount}}
    <br>
    <button @click="addCountN(3)">点击+3</button>
    <br>
    <button @click="addCountNAsync(5)">点击+5</button>
  </div>`,
  computed: {
    // mapState(['count'])
    ...mapState({
      count: state => state.count
    }),
    ...mapGetters([
      'addCount'
    ])
  },
  methods: {
    //参数自动传递
    ...mapMutations([
      'addCountN'
    ]),
    ...mapActions([
      'addCountNAsync'
    ])
  },
}
