<script>
import Layout from '@layouts/main'

export default {
  page: {
    title: 'Loading page...',
    meta: [{ name: 'description', content: 'Loading page...' }],
  },
  components: { Layout },
}
</script>

<template>
  <layout>
    <transition appear>
      <base-icon name="sync" spin />
    </transition>
  </layout>
</template>
