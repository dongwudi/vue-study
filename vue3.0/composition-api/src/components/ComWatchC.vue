<template>
  <div class="">
    <p>refCount: {{ refCount }}</p>
    <!-- 点击后，refCount虽然发生了变化，但是并没有打印出count，即已经停止了监听 -->
    <button @click="stopWatch">stop</button>
  </div>
</template>

<script>
import { ref, watch } from '@vue/composition-api'
export default {
  setup() {
    const refCount = ref(0)

    // watch 的返回值调用就会停止监听
    let stop = watch(refCount, (count, oldCount) => console.log(`count ${count}`), {
      lazy: true
    })

    // 如果watch 无指定并且回调中没有使用相关数据,只在初始化时执行一次,后续不会执行
    // let stop = watch(() => console.log('监听'))
    // let stop = watch(() => console.log(refCount.value))

    setTimeout(() => {
      refCount.value += 1
    }, 2000)

    const stopWatch = () => {
      stop()
    }

    return {
      refCount,
      stopWatch
    }
  }
}
</script>

<style lang="scss" scoped></style>
