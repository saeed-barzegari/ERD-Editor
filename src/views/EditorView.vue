<template>
  <div class="erd">
    <ERDTopBar
        @onOpenCode="showExportCode"
        @onExportImage="exportImage"
        @onZoomIn="zoom(0.1)"
        @onZoomOut="zoom(-0.1)"
        @onZoomFitToContent="zoomFitToContent"
        @onToggleGridDiagram="gridDiagramVisible"
        @onLogout="logout"
    />
    <div class="main">
      <ERDCanvas ref="erd"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import ERDCanvas from "@/components/ERDCanvas.vue";
import ERDTopBar from "@/components/ERDTopBar.vue";
import {onMounted, ref} from "vue";
import {notify} from "@kyvg/vue3-notification";
import router from "@/router";

const erd = ref<typeof ERDCanvas>();

function showExportCode(){
  erd.value?.showExportCode();
}

function exportImage(){
  erd.value?.downloadImage();
}

function zoom(scale:number) {
  erd.value?.zoom(scale);
}

function zoomFitToContent(){
  erd.value?.zoomFitToContent();
}

function gridDiagramVisible(visible: boolean) {
  erd.value?.gridVisible(visible)
}

function logout(){
  localStorage.removeItem("authToken");
  notify({
    title: "Authorization",
    text: "You are logged out!",
  });
  router.push("login")
}

</script>

<style scoped>
.erd {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
}

.main {
  display: flex;
  flex-direction: row;
  height: calc(100% - 64px);
  width: 100%;
}
</style>