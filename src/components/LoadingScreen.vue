<template>
<div class="loading-screen">
    Loading...
</div>
</template>

<script>
export default {
    name: 'LoadingScreen',
};
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  z-index: 4;
}
</style>