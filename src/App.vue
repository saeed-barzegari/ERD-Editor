<template>
    <div id="content">
      <router-view/>
    </div>
</template>

<style>
#content{
  width: calc(100%);
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

document.oncontextmenu = function (){return false}
</script>