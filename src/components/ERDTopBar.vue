<script setup lang="ts">

</script>

<template>
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
    </div>
    <div>
      <span class="save">Save</span>
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

.icon-orange {
  stroke: #8a6626;
  background: #FFBD44;
  border: 1px solid #c08e33;
  box-shadow: 0 0 3px #828691;
}

.icon-green {
  stroke: #016226;
  background: #00CA4E;
  border: 1px solid #02a441;
  box-shadow: 0 0 3px #828691;
}
</style>