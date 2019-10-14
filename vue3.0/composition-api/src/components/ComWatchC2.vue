<template>
  <div class="">
    <input type="text" v-model="kw" />
  </div>
</template>

<script>
import { ref, watch } from '@vue/composition-api'
export default {
  setup() {
    const kw = ref('')

    const print = val => {
      return setTimeout(() => {
        console.log(val)
      }, 1000)
    }

    watch(
      kw,
      (newVal, oldVal, onClean) => {
        let timerId = print(newVal)

        console.log(`new-${timerId}`)
        // 清除之前未执行的异步回调
        onClean(() => {
          console.log(`old-${timerId}`)
          clearTimeout(timerId)
        })
      },
      { lazy: true }
    )

    return {
      kw
    }
  }
}
</script>

<style lang="scss" scoped></style>
