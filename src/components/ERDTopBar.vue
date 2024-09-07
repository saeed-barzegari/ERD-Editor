<script setup lang="ts">
import {ref, defineModel} from "vue";

const gridVisible = ref(true);
const projectName = defineModel('projectName', {default: ref("")})
const versionNumber = defineModel('versionNumber', {default: ref(0)})

function gridVisibleToggle(){
  gridVisible.value = !gridVisible.value
}</script>

<template>
  <div id="navigator">
    <div class="top-bar">
      <div>
      <span class="icon icon-red" @click="$emit('onOpenCode')">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24">
          <path d="M7 8L3 11.6923L7 16M17 8L21 11.6923L17 16M14 4L10 20" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
        <span class="icon icon-green" @click="$emit('onExportImage')">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none">
          <path
              d="M12 16C13.6569 16 15 14.6569 15 13C15 11.3431 13.6569 10 12 10C10.3431 10 9 11.3431 9 13C9 14.6569 10.3431 16 12 16Z"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path
              d="M3 16.8V9.2C3 8.0799 3 7.51984 3.21799 7.09202C3.40973 6.71569 3.71569 6.40973 4.09202 6.21799C4.51984 6 5.0799 6 6.2 6H7.25464C7.37758 6 7.43905 6 7.49576 5.9935C7.79166 5.95961 8.05705 5.79559 8.21969 5.54609C8.25086 5.49827 8.27836 5.44328 8.33333 5.33333C8.44329 5.11342 8.49827 5.00346 8.56062 4.90782C8.8859 4.40882 9.41668 4.08078 10.0085 4.01299C10.1219 4 10.2448 4 10.4907 4H13.5093C13.7552 4 13.8781 4 13.9915 4.01299C14.5833 4.08078 15.1141 4.40882 15.4394 4.90782C15.5017 5.00345 15.5567 5.11345 15.6667 5.33333C15.7216 5.44329 15.7491 5.49827 15.7803 5.54609C15.943 5.79559 16.2083 5.95961 16.5042 5.9935C16.561 6 16.6224 6 16.7454 6H17.8C18.9201 6 19.4802 6 19.908 6.21799C20.2843 6.40973 20.5903 6.71569 20.782 7.09202C21 7.51984 21 8.0799 21 9.2V16.8C21 17.9201 21 18.4802 20.782 18.908C20.5903 19.2843 20.2843 19.5903 19.908 19.782C19.4802 20 18.9201 20 17.8 20H6.2C5.0799 20 4.51984 20 4.09202 19.782C3.71569 19.5903 3.40973 19.2843 3.21799 18.908C3 18.4802 3 17.9201 3 16.8Z"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      </div>
      <div>
      <span class="icon" @click="$emit('onZoomOut')">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none">
          <path d="M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20.9992 21L14.9492 14.95" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 10H14" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
        <span class="icon" @click="$emit('onZoomIn')">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none">
          <path d="M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20.9992 21L14.9492 14.95" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 10H14" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10 6V14" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
        <span class="icon" @click="$emit('onZoomFitToContent')">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 32 32" fill="#d9d9d9">
          <path d="M27.333 4c1.841 0 3.333 1.492 3.333 3.333v0 16c0 1.841-1.492 3.333-3.333 3.333v0h-21.333c-1.841 0-3.333-1.492-3.333-3.333v0-16c0-1.841 1.492-3.333 3.333-3.333v0zM27.333 5.333h-21.333c-1.105 0-2 0.895-2 2v0 16c0 1.105 0.895 2 2 2v0h21.333c1.105 0 2-0.895 2-2v0-16c0-1.105-0.895-2-2-2v0zM21.333 12v6.667h-9.333v-6.667h9.333zM20 13.333h-6.667v4h6.667v-4z"></path>
        </svg>
      </span>
        <span :class="gridVisible.valueOf() ? 'icon toggle-icon-enable': 'icon toggle-icon-disable'" @click="() => {gridVisibleToggle(); $emit('onToggleGridDiagram', gridVisible)}">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none">
          <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2.03 8.5H22" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2.03 15.5H22" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8.51 21.99V2.01001" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M15.51 21.99V2.01001" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      </div>
      <div>
        <span class="icon icon-green icon-green-fill" @click="$emit('onSave')">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
            <path clip-rule="evenodd" d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z"/>
          </svg>
        </span>
        <span class="icon icon-red" @click="$emit('onLogout')">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none">
          <path d="M9.00195 7C9.01406 4.82497 9.11051 3.64706 9.87889 2.87868C10.7576 2 12.1718 2 15.0002 2L16.0002 2C18.8286 2 20.2429 2 21.1215 2.87868C22.0002 3.75736 22.0002 5.17157 22.0002 8L22.0002 16C22.0002 18.8284 22.0002 20.2426 21.1215 21.1213C20.2429 22 18.8286 22 16.0002 22H15.0002C12.1718 22 10.7576 22 9.87889 21.1213C9.11051 20.3529 9.01406 19.175 9.00195 17" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M15 12L2 12M2 12L5.5 9M2 12L5.5 15" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      </div>
    </div>
    <div class="project-info">
      <span>{{ projectName }}</span>
      <span>V{{ versionNumber }}</span>
    </div>
  </div>
</template>

<style scoped>

.top-bar {
  width: 100%;
  height: 64px;
  background: #1c1e24;
  border-bottom: 1px solid #2d2f38;
  justify-content: space-between;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-shadow: 0 0 1px #00D8FF;
}

.top-bar > * {
  flex: 1 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.save{
  background: lawngreen;
  padding: 8px;
}

.icon {
  stroke: #d9d9d9;
  height: 24px;
  border-radius: 100%;
  padding: 4px;
  margin: 0 4px;
  cursor: pointer;
}

.icon-red {
  stroke: #8d3736;
  background: #FF605C;
  border: 1px solid #a13d3b;
  box-shadow: 0 0 3px #828691;
}

.icon-red:hover {
  background: #ff726f;
}

.icon-orange {
  stroke: #8a6626;
  background: #FFBD44;
  border: 1px solid #c08e33;
  box-shadow: 0 0 3px #828691;
}

.icon-orange:hover {
  background: #ffcb6f;
}

.icon-green {
  stroke: #016226;
  background: #00CA4E;
  border: 1px solid #02a441;
  box-shadow: 0 0 3px #828691;
}

.icon-green-fill {
  fill: #016226;
}

.icon-green:hover {
  background: #29ce69;
}

.toggle-icon-disable {
  stroke: #525252;
}

.project-info {
  min-width: 200px;
  color: #d9d9d9;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  padding: 4px;
  border: 1px solid #2d2f38;
  background-color: #1c1e24;
  position: absolute;
  top: 65px;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 1px 2px #00D8FF;
}


#navigator {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
}
</style>