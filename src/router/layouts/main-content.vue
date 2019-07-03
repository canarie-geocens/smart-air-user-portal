<template>
  <main role="main" class="flex-grow-1">
    <div class="main-content">
      <slot />
    </div>
  </main>
</template>

<style>
/* stylelint-disable */
main {
  width: 70%;
  height: 100vh;
  overflow-y: scroll;
}
/* stylelint-enable */
</style>
