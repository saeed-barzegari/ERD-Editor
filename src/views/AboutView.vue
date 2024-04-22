<template>
  <div class="erd">
    <ERDTopBar></ERDTopBar>
    <div class="main">
      <ResizeableSidebar></ResizeableSidebar>
      <ERDCanvas/>
      <ResizeableSidebar></ResizeableSidebar>
    </div>
  </div>
</template>
<script setup lang="ts">
import ERDCanvas from "@/components/ERDCanvas.vue";
import ResizeableSidebar from "@/components/ResizeableSidebar.vue";
import ERDTopBar from "@/components/ERDTopBar.vue";
</script>

<style scoped>
.erd {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
}

.main {
  display: flex;
  flex-direction: row;
  height: calc(100% - 64px);
  width: 100%;
}
</style>