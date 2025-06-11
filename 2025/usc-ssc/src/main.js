import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'virtual:uno.css'
import 'prismjs/themes/prism-okaidia.css' // Or any other theme
import 'prismjs/components/prism-python' // Add languages you need

createApp(App).mount('#app')
