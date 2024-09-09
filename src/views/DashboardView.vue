<script setup lang="ts">
import {ref} from 'vue';
import axios, {AxiosError} from "axios";
import ModalDialog from "@/components/ModalDialog.vue";
import VCard from "@/components/VCard.vue";
import {notify} from "@kyvg/vue3-notification";

const projects = ref([])
const projectName = ref('')
const projectNameErrors = ref([])
const addVisible = ref(false)


axios.get('http://127.0.0.1:8000/project/').then((response) => {
  projects.value = response.data
}).catch((e) => {
  console.log(e)
  projects.value = [];
})

function accessibilityToString(accessibility: number) {
  switch (accessibility) {
    case Accessibility.Owner.valueOf():
      return "Owner"
    case Accessibility.Editor.valueOf():
      return "Editor"
    case Accessibility.Visitor.valueOf():
      return "Visitor"
    default:
      return ""
  }
}

function addProject() {
  axios.post('http://127.0.0.1:8000/project/', {
    name: projectName.value
  }).then((response) => {
    addVisible.value = false;
    notify({
      title: "Projects",
      text: "New project added",
      type: "success"
    });
    projects.value.splice(0, 0, response.data as never)
  }).catch((e) => {
    const error = e as AxiosError;
    if (!error.response)
      return;
    const data = error.response.data as Record<string, never>;
    if (data['name'])
      projectNameErrors.value = data['name']
    else
      projectNameErrors.value = []
  })
}

enum Accessibility {
  Owner = 1,
  Editor = 2,
  Visitor = 3
}
</script>

<template>
  <ModalDialog v-model:visible="addVisible">
    <VCard class="add-card" title="Add Project">
      <form @submit.prevent="addProject">
        <div class="column w-100">
          <div class="column w-100 input">
            <label for="username">Project Name:</label>
            <input type="text" v-model="projectName" id="username" placeholder="Enter Project Name"/>
            <span class="error-message" v-for="(error, i) in projectNameErrors" :key="i">{{ error }}</span>
          </div>
          <div class="row">
            <button class="btn btn-green" type="submit">Add</button>
          </div>
        </div>
      </form>
    </VCard>
  </ModalDialog>
  <div class="dashboard">
    <VCard class="card w-50 projects-card" title="Projects">
      <template v-slot:header>
        <div class="column">
          <span class="btn btn-green" @click="() => addVisible = true">Add</span>
        </div>
      </template>

      <template v-slot:default>
        <div id="projects">
          <div class="header">
            <span class="w-40">Project Name</span>
            <span class="w-20">Accessibility</span>
            <div class="row w-40">
              <span class="w-50">Date Created</span>
              <span class="w-50">Time Created</span>
            </div>
          </div>
          <div class="project" v-for="(project, i) in projects" :key="i" @click="$router.push({name: 'editor', params: { slug: project['id'] } })">
            <span class="w-40">{{ project['name'] }}</span>
            <span class="w-20">{{ accessibilityToString(project['membership_type']) }}</span>
            <div class="row w-40">
              <span class="w-50">{{ new Date(project['created_at']).toLocaleDateString() }}</span>
              <span class="w-50">{{ new Date(project['created_at']).toLocaleTimeString() }}</span>
            </div>
          </div>
        </div>
      </template>
    </VCard>
  </div>
</template>

<style scoped>
.project {
  color: #d9d9d9;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: #ABABAB10;
  cursor: pointer;
}

.project:hover {
  background: #ABABAB1F;
}

.project:not(:first-child) {
  border-top: 1px solid #4f575f;
}

.project span {
  padding: 12px;
  overflow: hidden;
}

#projects {
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 300px;
  overflow-y: scroll;
}

.dashboard {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

#projects > .header {
  font-size: 1em;
  font-weight: bold;
  color: #d9d9d9;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: #ABABAB10;
}

#projects > .header span {
  padding: 12px;
  overflow: hidden;
}

.projects-card {
  min-width: 500px;
}

.add-card {
  width: 40vw;
  background: #1c1e24;
}

</style>