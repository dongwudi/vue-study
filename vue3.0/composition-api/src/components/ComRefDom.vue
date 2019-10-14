<template>
  <div class="">
    <p ref="refDom">refDom</p>
    <com-child ref="refCom" />
    <button @click="changeComStr">change</button>
  </div>
</template>

<script>
import { ref, onMounted } from '@vue/composition-api'
import ComChild from './ComChild'
export default {
  setup() {
    const refDom = ref(null)
    const refCom = ref(null)

    onMounted(() => {
      console.log(refDom)
      refDom.value.style.color = 'red'

      // 组件
      console.log(refCom)
      console.log(refCom.value.childStr)
    })

    const changeComStr = () => {
      refCom.value.setStr()
    }

    return {
      refDom,
      refCom,
      changeComStr
    }
  },
  components: {
    'com-child': ComChild
  }
}
</script>

<style lang="scss" scoped></style>
