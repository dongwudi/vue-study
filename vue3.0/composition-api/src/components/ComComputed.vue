<template>
  <div class="">
    <p>refCount: {{ refCount }}</p>
    <p>computedCount: {{ computedCount }}</p>
    <p>computedCount1: {{ computedCount1 }}</p>
    <button @click="refCount += 1">+1</button>
  </div>
</template>

<script>
import { ref, computed } from '@vue/composition-api'
export default {
  setup() {
    const refCount = ref(0)

    // 只读
    const computedCount = computed(() => refCount.value + 1)

    // 可读可写
    const computedCount1 = computed({
      get: () => refCount.value + 1,
      set: val => {
        refCount.value = val - 1
      }
    })

    setTimeout(() => {
      computedCount1.value = 2
    }, 2000)

    return {
      refCount,
      computedCount,
      computedCount1
    }
  }
}
</script>

<style lang="scss" scoped></style>
