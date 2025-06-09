<template>
  <svg :width="size" :height="size" :viewBox="viewBox">
    <!-- Orbits -->
    <ellipse class="orbit"
             id="succhiale1"
             :cx="center"
             :cy="center"
             :rx="radiusStep * (1 + 1) * orbit_radius_ratio[1]"
             :ry="radiusStep * (1 + 1)"
             :transform="`rotate(45 ${center} ${center})`"/>

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

let ctx;
onSlideEnter(() => {
    ctx = gsap.context(() => {
        let orbitPath = MotionPathPlugin.convertToPath("#succhiale1")[0];
        gsap.to(".electron", {
            motionPath: {
                path: orbitPath,
                align: orbitPath,
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