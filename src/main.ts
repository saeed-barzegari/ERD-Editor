import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './index.css'
import { VCodeBlock } from '@wdns/vue-code-block';
import Notifications from '@kyvg/vue3-notification'

createApp(App)
    .use(store)
    .use(router)
    .component('VCodeBlock', VCodeBlock)
    .use(Notifications)
    .mount('#app')
