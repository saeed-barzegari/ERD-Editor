<script setup lang="ts">
import {defineModel, ref} from "vue";

const visible = defineModel('visible', {default: false})

const modal = ref<Node>()
const container = ref<Node>()

document.addEventListener("mouseup", function (event) {
  if (event.target && visible.value)
    if (!container.value?.contains(event.target as Node)) {
      visible.value = false;
    }
});
</script>

<template>
  <div ref="modal" class="modal" v-if="visible">
    <div ref="container" class="container">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.27);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.modal > .container {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>