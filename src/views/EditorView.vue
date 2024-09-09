<template>
  <div class="loading" v-if="loading">
    <span>Loading...</span>
  </div>
  <div class="erd">
    <ERDTopBar
        @onOpenCode="showExportCode"
        @onExportImage="exportImage"
        @onZoomIn="zoom(0.1)"
        @onZoomOut="zoom(-0.1)"
        @onZoomFitToContent="zoomFitToContent"
        @onToggleGridDiagram="gridDiagramVisible"
        @onBack="back"
        @onSave="saveProject"
        @onDifferentShow="showDifferentVersionsModal"
        v-model:projectName="projectName"
        v-model:versionNumber="versionNumber"
    />
    <div class="main">
      <ERDCanvas ref="erd"/>
    </div>
  </div>
  <DifferentVersionModal v-model:maxVersionNumber="versionNumber" v-model:visible="differentModalVisible"/>
</template>
<script setup lang="ts">
import ERDCanvas from "@/components/ERDCanvas.vue";
import ERDTopBar from "@/components/ERDTopBar.vue";
import {onMounted, ref} from "vue";
import {notify} from "@kyvg/vue3-notification";
import router from "@/router";
import axios, {AxiosError} from "axios";
import {useRoute} from "vue-router";
import DifferentVersionModal from "@/components/DifferentVersionModal.vue";

if(!localStorage.getItem('authToken')){
  notify({
    title: "Authorization",
    text: "You must logged in!",
    type: "error"
  });
  router.push('/login');
}

const route = useRoute();
const erd = ref<typeof ERDCanvas>();
const projectName = ref('');
const versionNumber = ref(0);
const loading = ref(true);
const differentModalVisible = ref(false);

axios.get(`http://localhost:8000/project/get_last_version/${route.params['slug']}/`)
    .then((response) => {
      projectName.value = response.data['project_name'];
      versionNumber.value = response.data['version_number'];
      if (route.name == "editor") {
        if (response.data['code'])
          erd.value?.importProject(response.data['code']);
        setTimeout(() => {
          loading.value = false;
        }, 500)
      }
    })
    .catch(e => {
      const error = e as AxiosError
      if(error.status == 401)
        router.push('/login')
    })

if (route.name == "different") {
  axios.get(`http://localhost:8000/project/get_version/${route.params['slug']}/${route.params['version1']}/`)
      .then((response) => {
        let project1 = {};
        if (response.data['code'])
          project1 = response.data['code'];

        axios.get(`http://localhost:8000/project/get_version/${route.params['slug']}/${route.params['version2']}/`)
            .then((response) => {
              if (response.data['code']) {
                erd.value?.differentBetweenVersions(project1, response.data['code']);
              }
              setTimeout(() => {
                loading.value = false;
              }, 500)
            })
            .catch(e => {
              const error = e as AxiosError
              if (error.status == 401)
                router.push('/login')
              console.log(e)
            })
      })
      .catch(e => {
        const error = e as AxiosError
        if (error.status == 401)
          router.push('/login')
      })

}

function showDifferentVersionsModal() {
  differentModalVisible.value = true;
}

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

function back(){
  router.back();
}

async function saveProject() {
  try {
    await axios.post(`http://localhost:8000/project/save_project/${route.params['slug']}/`, {
      code: erd.value?.exportProject(),
    })
    notify({
      title: "Project",
      text: "Project saved.",
    });
    versionNumber.value = versionNumber.value + 1;
  } catch (e) {
    const error = e as AxiosError
    if (error.status == 401)
      await router.push('login')
  }
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

.loading {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: #1c1e24;
  z-index: 9999;
  color: #00D8FF;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>