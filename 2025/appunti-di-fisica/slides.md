---
# You can also start simply with 'default'
theme: default
title: Exploring Ultrastrong and Superstrong Coupling Regimes in Quantum Electrodynamics
# https://sli.dev/features/drawing
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: fade-out
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
# open graph
# seoMeta:
#  ogImage: https://cover.sli.dev
# layout: image-left
# image: assets/vincent_circuit.png
author: Alberto Mercurio
layout: center
# image: /images/vincent_circuit.png
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

<BohrAtom :enableAnimation="false" />


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
