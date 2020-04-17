<template>
  <div class="">
    <slot name="one">
      this is one
    </slot>
    <br />
    <slot name="two" v-bind:user="user">
      {{ user.lastName }}
    </slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        firstName: 'dong',
        lastName: 'wudi'
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
