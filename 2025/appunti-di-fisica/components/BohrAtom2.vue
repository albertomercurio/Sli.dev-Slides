<template>
  <svg :width="size" :height="size" :viewBox="viewBox">
    <!-- Orbits -->
    <path class="orbit"
          :key="'orbit-' + 1"
          id="succhiale1"
          :d="getEllipsePath(center, center, radiusStep * (1 + 1) * orbit_radius_ratio[1], radiusStep * (1 + 1))"/>

    <!-- Electrons -->
    <circle class="electron"
            id="cazzone1"
            :key="'e-' + 1 + '-' + 1"
            :cx="center"
            :cy="center"/>

    <!-- Nucleus: Alternating protons (red) and neutrons (gray) -->
     <circle class="proton"
             :cx="center"
             :cy="center"/>
  </svg>
</template>

<script setup>
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { onSlideEnter, onSlideLeave } from '@slidev/client'

gsap.registerPlugin(MotionPathPlugin)

const props = defineProps({
  orbit_radius_ratio: { type: Array, default: () => [1, 1.5] },
  size: { type: Number, default: 200 },
})

const center = props.size / 2
const radiusStep = props.size / 8
const viewBox = `0 0 ${props.size} ${props.size}`

function getEllipsePath(cx, cy, rx, ry) {
  // Draws a full ellipse with two arcs
  return `
    M ${cx - rx}, ${cy}
    A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy}
    A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}
`;
}

let ctx;
onSlideEnter(() => {
    ctx = gsap.context(() => {
        gsap.to(".electron", {
            motionPath: {
                path: "#succhiale1",
                align: "#succhiale1",
                alignOrigin: [0.5, 0.5],
            },
            duration: 2,
            repeat: -1,
            ease: "linear",
        })
    })
})

onSlideLeave(() => {
    // We delay the revert to avoid abrupt stops during slide transitions
    gsap.delayedCall(0.5, () => {
        ctx.revert()
    })
})

</script>

<style scoped>

.orbit {
  fill: none;
  stroke: #888;
  stroke-dasharray: 4 4;
}

.electron {
  fill: #00f;
  r: 4;
}

.proton {
  fill: #e74c3c;
  r: 6;
}
</style>