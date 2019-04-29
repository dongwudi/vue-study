export default {
  namespaced: true,
  state: {
    count: 0
  },
  getters:{
    doubleCount (state) {
      return state.count * 2
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  // ction 提交的是 mutation，而不是直接变更状态。
  // Action 可以包含任意异步操作。
  actions: {
    incrementIfOdd ({state, commit}) {
      if(state.count % 2 === 1){
        commit('increment')
      }
    },
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  },
}