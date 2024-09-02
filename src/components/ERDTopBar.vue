<script setup lang="ts">

</script>

<template>
  <div class="top-bar">
    <div>
      <span class="icon" @click="$emit('onOpenCode')">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24">
          <path d="M7 8L3 11.6923L7 16M17 8L21 11.6923L17 16M14 4L10 20" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </span>
    </div>
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

.icon {
  stroke: #ffdada;
  height: 24px;
  background: #ef5353;
  border-radius: 100%;
  padding: 4px;
  box-shadow: 0 0 3px #828691;
  border: 1px solid #c73b3b;
}
</style>