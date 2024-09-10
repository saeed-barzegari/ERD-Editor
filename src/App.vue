<template>
  <notifications />
  <NavigatorTopBar v-if="route.name && route.name != 'editor' && route.name != 'different'" :key="$route.fullPath"/>
    <div id="container" class="prevent-select">
      <router-view :key="$route.fullPath"/>
    </div>
</template>

<style>
#container{
  width: 100%;
  height: 100%;
}

#app{
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: #1c1e24;
  overflow: hidden;
}
</style>
<script setup lang="ts">

import {Notifications} from "@kyvg/vue3-notification";
import axios from "axios";
import NavigatorTopBar from "@/components/NavigatorTopBar.vue";
import router from "@/router";
import {useRoute} from "vue-router";

const route = useRoute();
axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem("authToken")}`
document.oncontextmenu = function (){return false}
</script>