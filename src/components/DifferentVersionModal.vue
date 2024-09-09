<script setup lang="ts">

import ModalDialog from "@/components/ModalDialog.vue";
import VCard from "@/components/VCard.vue";
import {defineModel, ref} from "vue";
import router from "@/router";

const maxVersionNumber = defineModel("maxVersionNumber", {required: true});
const visible = defineModel("visible", {default: false});
const version1 = ref(0);
const version2 = ref(1);

function showDifferent(){
  router.push({name: 'different', params: {version1: version1.value, version2: version2.value}})
}
</script>

<template>
<ModalDialog v-model:visible="visible">
  <VCard title="Different Between Versions" class="different-card">
    <template v-slot:default>
      <div class="column w-100">
        <div class="column w-100 input">
          <label for="username">Version 1:</label>
          <input type="number" min="0" :max="maxVersionNumber - 1" v-model="version1" id="username"/>
        </div>
        <div class="column w-100 input">
          <label for="username">Version 2:</label>
          <input type="number" :min="version1 + 1" :max="maxVersionNumber" v-model="version2" id="username"/>
        </div>
        <div class="row">
          <button class="btn btn-green" type="submit" @click="showDifferent">Show</button>
        </div>
      </div>
    </template>
  </VCard>
</ModalDialog>
</template>

<style scoped>
.different-card {
  background: #1c1e24;
}
</style>