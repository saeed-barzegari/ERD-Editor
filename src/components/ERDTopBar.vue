<script setup lang="ts">

</script>

<template>
  <div class="top-bar">
    <div>p</div>
    <div>p</div>
    <div>
      <span class="save">Save</span>
    </div>
  </div>
</template>

<style scoped>

.top-bar {
  width: 100%;
  height: 64px;
  background: #1c1e24;
  border-bottom: 1px solid #2d2f38;
  justify-content: space-between;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.top-bar > * {
  flex: 1 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.save{
  background: lawngreen;
  padding: 8px;
}
</style>