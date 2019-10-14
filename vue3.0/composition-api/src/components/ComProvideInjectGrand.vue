<template>
  <div class="" :style="{color: color}">
    <p>grand: {{ color }}</p>
  </div>
</template>

<script>
import { inject } from '@vue/composition-api'
export default {
  setup() {
    const color = inject('themeColor')

    console.log(color.value)

    setTimeout(() => {
      color.value = 'blue'
    }, 3000)

    return {
      color
    }
  }
}
</script>

<style lang="scss" scoped></style>
