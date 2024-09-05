<template>
  <notifications />
    <div id="container">
      <router-view/>
    </div>
</template>

<style>
#container{
  width: 100%;
  height: 100%;
}

#app{
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100%;
  background: #1c1e24;
  overflow: hidden;
}
</style>
<script setup lang="ts">

import {Notifications} from "@kyvg/vue3-notification";

document.oncontextmenu = function (){return false}
</script>