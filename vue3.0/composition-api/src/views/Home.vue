<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <!-- <set-up set="setup" /> -->
    <!-- <com-reactive /> -->
    <!-- <com-ref /> -->
    <!-- <com-to-refs /> -->
    <!-- <com-computed /> -->
    <!-- <com-watch /> -->
    <!-- <com-watch-c /> -->
    <!-- <com-watch-c2 /> -->
    <!-- <com-life-cycle /> -->
    <!-- <com-provide-inject /> -->
    <com-ref-dom />
  </div>
</template>

<script>
// @ is an alias to /src
// import SetUp from '@/components/SetUp.vue'
// import ComReactive from '@/components/ComReactive.vue'
// import ComRef from '@/components/ComRef.vue'
// import ComToRefs from '@/components/ComToRefs.vue'
// import ComComputed from '@/components/ComComputed.vue'
// import ComWatch from '@/components/ComWatch.vue'
// import ComWatchC from '@/components/ComWatchC.vue'
// import ComWatchC2 from '@/components/ComWatchC2.vue'
// import ComLifeCycle from '@/components/ComLifeCycle.vue'
// import ComProvideInject from '@/components/ComProvideInject.vue'
import ComRefDom from '@/components/ComRefDom.vue'

export default {
  name: 'home',
  components: {
    // 'set-up': SetUp,
    // 'com-reactive': ComReactive,
    // 'com-ref': ComRef,
    // 'com-to-refs': ComToRefs,
    // 'com-computed': ComComputed,
    // 'com-watch': ComWatch,
    // 'com-watch-c': ComWatchC,
    // 'com-watch-c2': ComWatchC2,
    // 'com-life-cycle': ComLifeCycle,
    // 'com-provide-inject': ComProvideInject,
    'com-ref-dom': ComRefDom
  }
}
</script>
