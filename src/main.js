import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vue3-openlayers/styles.css'

import OpenLayersMap from 'vue3-openlayers'

const app = createApp(App)

app.use(router)

const options = {
  debug: false,
}
app.use(OpenLayersMap, options)

app.mount('#app')
