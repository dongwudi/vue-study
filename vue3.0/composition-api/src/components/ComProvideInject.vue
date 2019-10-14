<template>
  <div class="">
    parent: {{ color }}
    <com-provide-inject-child />
  </div>
</template>

<script>
import ComProvideInjectChild from './ComProvideInjectChild'
import { ref, provide } from '@vue/composition-api'
export default {
  setup() {
    const color = ref('red')

    provide('themeColor', color)
    return {
      color
    }
  },
  components: {
    ComProvideInjectChild
  }
}
</script>

<style lang="scss" scoped></style>
