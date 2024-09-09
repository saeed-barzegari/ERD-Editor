<script lang="ts" setup>
import axios, {AxiosError} from 'axios';
import {notify} from "@kyvg/vue3-notification";
import router from "@/router";
import {ref} from 'vue'

const firstName = ref('');
const lastName = ref('');
const username = ref('');
const email = ref('');
const company = ref('');
const password = ref('');
const rePassword = ref('');
const firstNameErrors = ref([])
const lastNameErrors = ref([])
const usernameErrors = ref([])
const emailErrors = ref([])
const companyErrors = ref([])
const passwordErrors = ref([])
const rePasswordErrors = ref([])

if(localStorage.getItem('authToken')){
  notify({
    title: "Authorization",
    text: "You have been logged in!",
  });
  router.push('/dashboard');
}
async function loginUser() {
  try {
    const response = await axios.post('http://127.0.0.1:8000/user/register/', {
      first_name: firstName.value,
      last_name: lastName.value,
      username: username.value,
      email: email.value,
      company: company.value,
      password: password.value,
      password2: rePassword.value
    });
    const data = response.data;

    notify({
      title: "Authorization",
      text: "You are logged in",
      type: "success"
    });
    const token = data.token;
    localStorage.setItem('authToken', token);
    await router.push('/dashboard');
  } catch (e) {
    const error = e as AxiosError;
    if (!error.response)
      return;
    const data = error.response.data as Record<string, never>
    if (data && typeof data === 'object') {
      if (data['first_name'])
        firstNameErrors.value = data['first_name']
      else
        firstNameErrors.value = []

      if (data['last_name'])
        lastNameErrors.value = data['last_name']
      else
        lastNameErrors.value = []

      if (data['username'])
        usernameErrors.value = data['username']
      else
        usernameErrors.value = []

      if (data['email'])
        emailErrors.value = data['email']
      else
        emailErrors.value = []

      if (data['company'])
        companyErrors.value = data['company']
      else
        companyErrors.value = []

      if (data['password'])
        passwordErrors.value = data['password']
      else
        passwordErrors.value = []

      if (data['password2'])
        rePasswordErrors.value = data['password2']
      else
        rePasswordErrors.value = []

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
        <h2>Sign Up</h2>
      </div>
      <div class="content">
          <div class="column w-100">
            <form @submit.prevent="loginUser">
              <div class="column w-100">
                <div class="row w-100">
                  <div class="column w-50">
                    <label for="first-name">First Name:</label>
                    <input
                        type="text"
                        v-model="firstName"
                        id="first-name"
                        placeholder="Enter Your First Name"
                    />
                    <span class="error-message" v-for="(error, i) in firstNameErrors" :key="i">{{ error }}</span>
                  </div>
                  <div class="column w-50">
                    <label for="last-name">Last Name:</label>
                    <input
                        type="text"
                        v-model="lastName"
                        id="last-name"
                        placeholder="Enter Your Last Name"
                    />
                    <span class="error-message" v-for="(error, i) in lastNameErrors" :key="i">{{ error }}</span>
                  </div>

                </div>
                <div class="column w-100">
                  <label for="username">Username:</label>
                  <input
                      type="text"
                      v-model="username"
                      id="username"
                      placeholder="Enter Your Username"
                  />
                  <span class="error-message" v-for="(error, i) in usernameErrors" :key="i">{{ error }}</span>
                </div>
                <div class="column w-100">
                  <label for="email">Email:</label>
                  <input
                      type="text"
                      v-model="email"
                      id="email"
                      placeholder="Email"
                  />
                  <span class="error-message" v-for="(error, i) in emailErrors" :key="i">{{ error }}</span>
                </div>
                <div class="column w-100">
                  <label for="company">Company:</label>
                  <input
                      type="text"
                      v-model="company"
                      id="company"
                      placeholder="Enter Your Company"
                  />
                  <span class="error-message" v-for="(error, i) in companyErrors" :key="i">{{ error }}</span>
                </div>
                <div class="column">
                  <label for="password">Password:</label>
                  <input
                      type="password"
                      v-model="password"
                      id="password"
                      placeholder="Enter Your Password"
                  />
                  <span class="error-message" v-for="(error, i) in passwordErrors" :key="i">{{ error }}</span>
                </div>
                <div class="column">
                  <label for="re-password">Re-Password:</label>
                  <input
                      type="password"
                      v-model="rePassword"
                      id="re-password"
                      placeholder="Repeat Your Password"
                  />
                  <span class="error-message" v-for="(error, i) in rePasswordErrors" :key="i">{{ error }}</span>
                </div>
                <div class="row">
                  <button class="btn btn-green" type="submit">Sign Up</button>
                </div>
              </div>
            </form>
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

label {
  color: #b6b6b6;
  padding: 4px;
}
</style>