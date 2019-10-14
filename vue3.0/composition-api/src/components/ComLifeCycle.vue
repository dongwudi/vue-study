<template>
  <div class="">lifeCycle</div>
</template>

<script>
import { onBeforeMount, onMounted } from '@vue/composition-api'
export default {
  setup() {
    onBeforeMount(() => {
      console.log('onBeforeMount')
    })

    onMounted(() => {
      console.log('onMounted')
    })
  }
}
</script>

<style lang="scss" scoped></style>
