<template>
  <div class="container-fluid">
    <div class="row d-flex">
      <side-bar />
      <slot />
    </div>
  </div>
</template>

<script>
import SideBar from '@components/side-bar'

export default {
  components: { SideBar },
}
</script>
