<template>
  <div class="">
    {{ count }}
    <button @click="add">+1</button>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api'
export default {
  setup() {
    const state = reactive({
      count: 0,
      name: 'dong'
    })

    // add
    const add = () => {
      console.log(state.count)
      state.count += 1
    }

    // 使用 toRefs 把 state 中的每个属性数据全都变为响应式的
    const stateRef = toRefs(state)

    return {
      // reactive 用过展开操作符后，state中的值就不再是响应式的，是固定的了，所以外部使用add函数并么有产生 +1 的效果
      // ...state,
      ...stateRef,
      add
    }
  }
}
</script>

<style lang="scss" scoped></style>
