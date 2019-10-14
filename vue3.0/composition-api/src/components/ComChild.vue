<template>
  <div class="">
    <p>child: {{ childStr }}</p>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api'
export default {
  setup() {
    let childStr = ref('str')

    const setStr = () => {
      childStr.value = 'this has change'
    }
    return {
      childStr,
      setStr
    }
  }
}
</script>

<style lang="scss" scoped></style>
