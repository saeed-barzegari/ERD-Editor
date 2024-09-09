<script setup lang="ts">

import router from "@/router";
import {notify} from "@kyvg/vue3-notification";

const isAuthenticated = localStorage.getItem('authToken') != null

function logout() {
  localStorage.removeItem("authToken");
  notify({
    title: "Authorization",
    text: "You are logged out!",
  });
  router.push("/login")
}
</script>

<template>
  <div id="navigator">
    <div class="nav">
      <ul>
        <li>Home</li>
        <li>About</li>
      </ul>
    </div>
    <div class="buttons">
      <template v-if="isAuthenticated">
        <span class="nav-btn logout" @click="logout">Logout</span>
        <span class="nav-btn dashboard" @click="router.push('/dashboard')">Dashboard</span>
      </template>
      <template v-else>
        <span class="nav-btn sign-up" @click="router.push('/register')">Sign Up</span>
        <span class="nav-btn sign-in" @click="router.push('/login')">Sign In</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
#navigator {
  width: 100%;
  height: 64px;
  background: #1c1e24;
  border-bottom: 1px solid #2d2f38;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: white;
  overflow: hidden;
}

#navigator .nav {
  height: 100%;
  border-left: 12px solid #00D8FF;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
}

#navigator .nav ul{
  display: flex;
  flex-direction: row;
}

#navigator .nav > ul > li{
  padding: 8px;
}

.nav-btn {
  width: 150px;
  height: 100%;
  cursor: pointer;
  align-items: center;
  display: flex;
  justify-content: center;
}

.sign-in {
  background: #22ff00;
}

.sign-up {
  background: #b0aa26;
}

.dashboard {
  background: #00D8FF;
}

.logout {
  background: #8d3736;
}

.buttons {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>