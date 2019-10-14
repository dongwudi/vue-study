<template>
  <div class="">
    {{ state.count }}
    <button @click="state.count += 1">+</button>
  </div>
</template>

<script>
// reactive 接收一个普通对象，返回一个响应式数据对象
import { reactive } from '@vue/composition-api'

export default {
  setup(props, ctx) {
    const state = reactive({ count: 1 })
    console.log(state)

    return {
      state
    }
  }
}
</script>

<style lang="scss" scoped></style>
