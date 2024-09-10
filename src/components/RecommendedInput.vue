<script lang="ts" setup>
import {ref, defineModel} from "vue";

const searchQuery = defineModel('value', {default: ''})
const placeholder = defineModel('placeholder', {default: ''})
const showDropdown = ref(false)
const recommendations = defineModel('recommendations', {default: [], type: Array<string>})
const filteredRecommendations = ref<string[]>([])


function filterRecommendations() {
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filteredRecommendations.value = recommendations.value.filter(item =>
        item.toLowerCase().includes(query)
    );
  } else {
    filteredRecommendations.value = [];
  }
}

function selectRecommendation(item: string) {
  searchQuery.value = item;
  showDropdown.value = false;
}

function hideDropdown() {
  setTimeout(() => {
    showDropdown.value = false;
  }, 100);
}

</script>
<template>
  <div class="autocomplete">
    <input
        v-model="searchQuery"
        @input="filterRecommendations"
        @focus="showDropdown = true"
        @focusout="(e: FocusEvent) => {hideDropdown(); $emit('focusout', e)}"
        :placeholder="placeholder"
    />
    <ul v-if="showDropdown" class="dropdown">
      <li
          v-for="(item, index) in filteredRecommendations"
          :key="index"
          @mousedown="selectRecommendation(item)"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.autocomplete {
  position: relative;
}

input {
  padding: 4px;
  margin: 2px;
  background: #25272d;
  border: 1px solid #828691;
  color: #b5b9be;
  font-size: 0.6em;
}

input:focus {
  border: 1px solid #c3c7d0;
  outline: none;
}

.dropdown {
  position: absolute;
  background: #25272d;
  border: 1px solid #ccc;
  width: 100%;
  max-height: 150px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 999;
}

.dropdown li {
  padding: 8px;
  cursor: pointer;
}

.dropdown li:hover {
  background-color: #f0f0f0;
}
</style>