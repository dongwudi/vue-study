<template>
  <div class="">
    refCount: {{refCount}}
    <button @click="refCount += 1">+</button>
  </div>
</template>

<script>
// ref() 函数用来根据给定的值创建一个响应式的数据对象, 返回值是一个对象，只有一个 value 属性
import { ref, isRef } from '@vue/composition-api'
export default {
  setup() {
    let refCount = ref(0)
    console.log(refCount)

    let a = 1
    console.log(isRef(a), isRef(refCount))
    return {
      refCount
    }
  }
}
</script>

<style lang="scss" scoped></style>
