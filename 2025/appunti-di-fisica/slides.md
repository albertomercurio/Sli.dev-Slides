---
theme: default
title: Exploring Ultrastrong and Superstrong Coupling Regimes in Quantum Electrodynamics
transition: fade-out
mdc: true
author: Alberto Mercurio
layout: center
class: h-full flex flex-col text-center
---
## **Exploring Ultrastrong and Superstrong Coupling Regimes in Quantum Electrodynamics**

<hr class="w-full my-6 border-epfl" />

Alberto Mercurio

<!-- Put BohrAtom component in the bottom-right -->
<div class="absolute bottom-0 right-0 mr-16 mb-4 flex items-center gap-x-2">
<CavityMirror />
<BohrAtom :size=150 />
<CavityMirror class="rotate-180" />
</div>

---
layout: center
transition: fade-out
---

  
<BohrAtom ref="atomRef" class="my-atom" />
<div ref="photonRef" class="absolute w-3 h-3 rounded-full bg-yellow-400 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />

<script setup>

import { ref } from 'vue';
import { onSlideEnter, onSlideLeave } from '@slidev/client';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

const atomRef = ref(null);
const photonRef = ref(null);

const timeline = gsap.timeline({pause: true});
onSlideEnter(() => {
  if (!atomRef.value || !photonRef.value) {
    console.warn('BohrAtom or photon element not found');
    return;
  }

  const svgEl = atomRef.value.rootRef;

  const electron = atomRef.value.electronsList[0][1] // Choose electron 1 on orbit 0
  const targetOrbit = atomRef.value.orbitsList[1]     // Orbit 1
  const oldOrbit = atomRef.value.orbitsList[0]

  const oldPath = MotionPathPlugin.convertToPath(oldOrbit)[0]
  const newPath = MotionPathPlugin.convertToPath(targetOrbit)[0]

  const electronTweens = gsap.getTweensOf(electron)
  if (electronTweens.length === 0) {
    console.warn('No tweens found for the electron');
    return;
  }

  const electronTween = electronTweens[0];
  console.log('Electron Tween:', electronTween);

  gsap.set(photonRef.value, {
    x: -200,
    y: gsap.getProperty(electron, 'y'),
    opacity: 0
  });

  timeline.to(svgEl, {
    x: 200,
    duration: 2,
    delay: 1
  });

  timeline.play();

  console.log('Slide entered');
});

onSlideLeave(() => {
  console.log('Slide left');
  timeline.pause(0);
  timeline.kill();
});

</script>


---
transition: fade-out
---

# View Transition {.inline-block.view-transition-title}

<div view-transition-name="shared-box" class="bg-red-500 w-32 h-32"></div>

<span view-transition-name="equation">$\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$</span>

<BohrAtom />


---

# Vista Transizione {.inline-block.view-transition-title}

<div view-transition-name="shared-box" class="bg-blue-500 w-64 h-64"></div>

---
layout: center
class: text-center w-full h-full px-2
---

# Learn More

<div class="w-full grid grid-cols-3 gap-4">
  <div class="col-span-1 bg-gray-100 p-4">
    Left column — 1/3 width
  </div>
  <div class="col-span-2 bg-gray-200 p-4">
    Right column — 2/3 width
  </div>
</div>
