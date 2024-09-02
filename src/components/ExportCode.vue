<script setup lang="ts">
import {defineModel, ref} from "vue";
import "prismjs";
import 'prismjs/components/prism-sql';

const visible = defineModel('visible', {default: false});
const code = defineModel('code', {default: ""});
const exportCode = ref<Node>();
const container = ref<Node>();

document.addEventListener("mouseup", function (event) {
  if (event.target && visible.value)
    if (!exportCode.value?.contains(event.target as Node)){
      visible.value = false;
    }
});
</script>

<template>
  <div class="container" v-if="visible" ref="container">
    <div class="exportCode" ref="exportCode">
    <VCodeBlock height="300px" :code="code" lang="sql" prismjs/>
    </div>
  </div>
</template>

<style scoped>

.container {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  position: fixed;
  justify-content: center;
  width: 100%;
  z-index: 100;
  align-items: center;
}

.exportCode {
  min-width: 50%;
}
</style>