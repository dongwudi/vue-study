<template>
  <div class="">
    <p>refCount: {{ refCount }}</p>
  </div>
</template>

<script>
import { ref, watch, reactive } from '@vue/composition-api'
export default {
  setup() {
    const refCount = ref(0)
    const refName = ref('ls')
    const reaCount = reactive({ count: 0, name: 'ls' })

    // 监视 reactive lazy: true 控制初始化时是否执行监听回调
    // watch(() => reaCount.count, (newVal, oldVal) => console.log(newVal, oldVal), { lazy: true })

    // 监视 ref
    // watch(refCount, (newVal, oldVal) => console.log(newVal, oldVal), { lazy: true })

    // 监视多个 reactive 数据
    // watch(
    //   [() => reaCount.count, () => reaCount.name],
    //   ([count, name], [oldCount, oldName]) => {
    //     console.log(count, oldCount, '--', name, oldName)
    //   },
    //   {
    //     lazy: true
    //   }
    // )

    // 监视多个 ref 数据
    watch(
      [refCount, refName],
      ([count, name], [oldCount, oldName]) => {
        console.log(count, oldCount, '--', name, oldName)
      },
      {
        lazy: true
      }
    )

    setTimeout(() => {
      reaCount.count += 1
      reaCount.name = 'zs'

      refCount.value += 1
      refName.value = 'zs'
    }, 2000)

    return {
      refCount,
      reaCount
    }
  }
}
</script>

<style lang="scss" scoped></style>
