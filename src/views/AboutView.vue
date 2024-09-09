<script setup lang="ts">

import VCard from "@/components/VCard.vue";
</script>

<template>
  <div id="about">
    <VCard title="About Us" class="about-card w-40">
      <template v-slot:default>
        <div class="info">
          <img src="@/assets/University_Logo.png" alt="" width="100px">
          <p>Yazd Univercity</p>
          <p>Bachelor Project</p>
          <p>Mentor: Dr.Pajoohan</p>
          <p>Author: Saeed Barzegari</p>
        </div>
      </template>
    </VCard>
  </div>
</template>

<style scoped>
#about {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  align-items: center;
  color: white;
}

.info p {
  padding: 8px;
  font-size: 1em;
}
.about-card {

}
</style>