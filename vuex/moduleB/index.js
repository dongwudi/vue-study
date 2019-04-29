export default {
  state: {
    count: 0
  },
  getters:{
    addCount: state => {
      let count = state.count;
      return ++count;
    }
  },
  mutations: {
    addCountN(state, payload) {
      state.count += payload
    }
  },
  // ction 提交的是 mutation，而不是直接变更状态。
  // Action 可以包含任意异步操作。
  actions: {
    addCountNAsync (context, payload) {
      setTimeout (()=>{
        context.commit('addCountN',payload)
      },1000) 
    }
  },
}