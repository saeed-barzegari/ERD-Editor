<script lang="ts" setup>
import axios, {AxiosError} from 'axios';
import {notify} from "@kyvg/vue3-notification";
import router from "@/router";
import {ref} from 'vue'

const username = ref('');
const password = ref('');
const usernameErrors = ref([])
const passwordErrors = ref([])

if(localStorage.getItem('authToken')){
  notify({
    title: "Authorization",
    text: "You have been logged in!",
  });
  router.push('/editor');
}
async function loginUser() {
  try {
    const response = await axios.post('http://127.0.0.1:8000/user/login/', {
      username: username.value,
      password: password.value
    });
    const data = response.data;

    notify({
      title: "Authorization",
      text: "You are logged in",
      type: "success"
    });
    const token = data.token;
    localStorage.setItem('authToken', token);
    await router.push('/editor');
  } catch (e) {
    const error = e as AxiosError;
    if (!error.response)
      return;
    const data = error.response.data as Record<string, never>
    if (data && typeof data === 'object') {
      if (data['username'])
        usernameErrors.value = data['username']

      if (data['password'])
        passwordErrors.value = data['password']

      if (data['detail'])
        notify({
          title: "Authorization",
          text: data['detail'],
          type: "error"
        });
    }
  }
}

</script>

<template>
  <div class="login">
    <div class="card">
      <div class="header">
        <h2>Login</h2>
      </div>
      <div class="content">
        <div class="row">
          <div class="column w-100">
            <form @submit.prevent="loginUser">
              <div class="column w-100">
                <div class="column w-100">
                  <label for="username">Username:</label>
                  <input
                      type="text"
                      v-model="username"
                      id="username"
                      placeholder="Username"
                  />
                  <span class="error-message" v-for="(error, i) in usernameErrors" :key="i">{{ error }}</span>
                </div>
                <div class="column">
                  <label for="password">Password:</label>
                  <input
                      type="password"
                      v-model="password"
                      id="password"
                      placeholder="Password"
                  />
                  <span class="error-message" v-for="(error, i) in passwordErrors" :key="i">{{ error }}</span>
                </div>
                <div class="row">
                  <button class="btn btn-green" type="submit">Login</button>
                </div>
              </div>
            </form>
          </div>
          <div class="login-logo">
            <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                 viewBox="0 0 512 512" xml:space="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier"> <g> <g> <path
                  d="M432.624,214.472h-2.628v-67.811c0-39.275-15.378-76.194-43.302-103.959C358.977,15.144,322.304,0,283.343,0 c-0.287,0-0.576,0.001-0.864,0.002C202.081,0.464,136.673,66.94,136.673,148.188v36.321c0,4.355,3.53,7.885,7.885,7.885h42.053 c4.355,0,7.885-3.53,7.885-7.885v-36.615c0-49.193,39.459-89.597,87.96-90.067c23.882-0.187,46.361,8.91,63.356,25.741 c16.998,16.835,26.36,39.241,26.36,63.093v67.811H134.045c-21.74,0-39.425,17.686-39.425,39.425v250.218 c0,4.355,3.53,7.885,7.885,7.885h361.659c4.355,0,7.885-3.53,7.885-7.885V253.897 C472.049,232.158,454.364,214.472,432.624,214.472z M356.909,72.363c-20.009-19.816-46.504-30.609-74.605-30.305 c-57.113,0.554-103.577,48.031-103.577,105.836v28.73h-26.283v-28.436c0-72.602,58.374-132.003,130.126-132.416 c0.259-0.001,0.512-0.002,0.771-0.002c34.765,0,67.497,13.519,92.235,38.115c24.924,24.782,38.651,57.731,38.651,92.776v67.811 h-26.283v-67.811C387.942,118.568,376.921,92.182,356.909,72.363z M456.279,496.23H110.39V253.897 c0-13.044,10.611-23.655,23.655-23.655h246.037h42.029h10.513c13.044,0,23.655,10.611,23.655,23.655V496.23z"></path> </g> </g>
                <g> <g> <path
                    d="M297.578,350.283c22.964-6.271,39.9-27.304,39.9-52.229c0-29.855-24.289-54.144-54.144-54.144 s-54.144,24.289-54.144,54.144c0,24.925,16.936,45.958,39.9,52.229c-39.322,6.783-69.338,41.112-69.338,82.342v42.053 c0,4.355,3.53,7.885,7.885,7.885h151.392c4.355,0,7.885-3.53,7.885-7.885v-42.053C366.916,391.395,336.9,357.066,297.578,350.283z M244.961,298.053c0-21.159,17.215-38.374,38.374-38.374s38.374,17.215,38.374,38.374s-17.215,38.374-38.374,38.374 S244.961,319.213,244.961,298.053z M351.146,466.793H215.524v-34.168c0-37.391,30.42-67.811,67.811-67.811 s67.811,30.42,67.811,67.811V466.793z"></path> </g> </g>
                <g> <g> <path
                    d="M422.111,269.142c-4.355,0-7.885,3.53-7.885,7.885V382.16c0,4.355,3.53,7.885,7.885,7.885s7.885-3.53,7.885-7.885V277.027 C429.996,272.672,426.465,269.142,422.111,269.142z"></path> </g> </g>
                <g> <g> <path
                    d="M422.111,403.713c-4.355,0-7.885,3.53-7.885,7.885v42.053c0,4.355,3.53,7.885,7.885,7.885s7.885-3.53,7.885-7.885v-42.053 C429.996,407.243,426.465,403.713,422.111,403.713z"></path> </g> </g>
                <g> <g> <path
                    d="M80.546,175.305h-32.71c-4.355,0-7.885,3.53-7.885,7.885s3.53,7.885,7.885,7.885h32.71c4.355,0,7.885-3.53,7.885-7.885 S84.9,175.305,80.546,175.305z"></path> </g> </g>
                <g> <g> <path
                    d="M95.253,150.851l-20.815-20.815c-3.079-3.079-8.072-3.079-11.15,0c-3.079,3.079-3.079,8.072,0,11.151l20.815,20.815 c1.539,1.539,3.558,2.31,5.575,2.31s4.036-0.77,5.575-2.31C98.332,158.923,98.332,153.93,95.253,150.851z"></path> </g> </g>
                <g> <g> <path
                    d="M95.042,204.377c-3.079-3.079-8.072-3.079-11.15,0l-20.815,20.815c-3.079,3.079-3.079,8.072,0,11.15 c1.539,1.54,3.558,2.31,5.575,2.31s4.036-0.77,5.575-2.31l20.815-20.815C98.122,212.45,98.122,207.457,95.042,204.377z"></path> </g> </g> </g></svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
}

input {
  padding: 8px;
  margin: 4px 8px;
  background-color: #25272d !important;
  border: 1px solid #828691 !important;
  color: #b5b9be;
  font-size: 0.6em;
}

input:focus {
  border: 1px solid #c3c7d0;
  outline: none;
}

.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.login-logo {
  fill: #b6b6b6;
  width: 200px;
  color: white;
}

label {
  color: #b6b6b6;
  padding: 4px;
}
</style>