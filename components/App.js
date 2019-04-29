export default {
  template: `
  <div>
    count -- {{ count }}
    <br>
    addcount -- {{addCount}}
    <br>
    <button @click="countN(3)">点击+3</button>
    <br>
    <button @click="countNAsnyc(5)">点击+5</button>
  </div>`,
  computed: {
    count () {
      return this.$store.state.count;
    },
    addCount () {
      return this.$store.getters.addCount;
    }
  },
  methods: {
    countN (n) {
      this.$store.commit('addCountN',n)
    },
    countNAsnyc (n) {
      this.$store.dispatch('addCountNAsync', n);
    }
  },
}