<template>
    <MenuSide></MenuSide>
    <div id="content">
      <router-view/>
    </div>
</template>

<style>
#content{
  width: calc(100% - var(--menu-width-size) - 0px);
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
import MenuSide from "@/components/MenuSide.vue";

document.oncontextmenu = function (){return false}
</script>