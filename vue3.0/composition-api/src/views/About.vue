<template>
  <div class="">
    <about-view>
      <template v-slot:one>
        this is one about
      </template>
      <template v-slot:two="{user}">
        {{user.firstName}}
      </template>
    </about-view>
  </div>
</template>

<script>
import AboutView from './AboutView'

export default {
  // render(h) {
  //   return h('div', {
  //     domProps: {
  //       innerHTML: 'this is innerHTml'
  //     }
  //   })
  // },
  components: {
    AboutView
  }
}
</script>

<style lang="scss" scoped></style>
