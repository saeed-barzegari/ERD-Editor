<script setup lang="ts">
import {defineModel} from "vue";

const text = defineModel('text', {required: true})
const value = defineModel('value', {default: false})
</script>

<template>
  <span @click="value = !value" :class="value ? 'enable' : 'disable'">{{ text }}</span>
</template>

<style scoped>

</style>