<script setup lang="ts">
import {defineModel} from "vue";

const title = defineModel('title')
</script>

<template>
  <div class="card">
    <div class="header" v-if="title">
      <div class="column"><h2 class="title">{{ title }}</h2></div>
      <slot name="header"></slot>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>

</style>