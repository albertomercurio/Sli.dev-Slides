import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'virtual:uno.css'
import 'katex/dist/katex.min.css'
import './styles/slidev-vars.css'
import './styles/slidev-index.css'
import './styles/slidev-layouts-base.css'
import './styles/slidev-layouts.css'

// App Components
import SlideContainer from './components/layouts/SlideContainer.vue'
import GlobalFrame from './components/layouts/GlobalFrame.vue'
import Center from './components/layouts/Center.vue'
import SlideTitle from './components/app/SlideTitle.vue'
import EmptySVG from './components/app/EmptySVG.vue'
import CodeBlock from './components/app/CodeBlock.vue'
import Latex from './components/app/LaTeX.vue'
import Arrow from './components/app/Arrow.vue'

// User Components
import BohrAtom from './components/BohrAtom.vue'
import CavityMirror from './components/CavityMirror.vue'

const app = createApp(App)

//  Registering App Components
app.component('SlideContainer', SlideContainer)
app.component('GlobalFrame', GlobalFrame)
app.component('Center', Center)
app.component('SlideTitle', SlideTitle)
app.component('EmptySVG', EmptySVG)
app.component('CodeBlock', CodeBlock)
app.component('Latex', Latex)
app.component('Arrow', Arrow)

// Registering User Components
app.component('BohrAtom', BohrAtom)
app.component('CavityMirror', CavityMirror)

app.mount('#app')