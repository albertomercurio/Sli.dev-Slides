<template>
  <svg :width="size" :height="size" :viewBox="viewBox">
    <!-- Orbits -->
    <ellipse v-for="(count, i) in orbits"
             class="orbit"
             :key="'orbit-' + i"
             :id="'orbit-' + i"
             :cx="center"
             :cy="center"
             :rx="radiusStep * (i + 1) * orbit_radius_ratio[i]"
             :ry="radiusStep * (i + 1)"
             :transform="`rotate(45 ${center} ${center})`"/>

    <!-- Electrons -->
    <template v-for="(electronCount, orbitIndex) in orbits"
      :key="'electrons-' + orbitIndex">
      <circle v-for="electronIndex in electronCount"
              :key="'e-' + orbitIndex + '-' + electronIndex"
              :id="'electron-' + orbitIndex + '-' + electronIndex"
              class="electron"
              :cx="center"
              :cy="center"/>
    </template>


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
  orbits: { type: Array, default: () => [2, 3] },
  speeds: { type: Array, default: () => [6, 4] },
  orbit_radius_ratio: { type: Array, default: () => [1, 1.5] },
  size: { type: Number, default: 200 },
})

const center = props.size / 2
const radiusStep = props.size / 8
const viewBox = `0 0 ${props.size} ${props.size}`

let ctx;
onSlideEnter(() => {
    ctx = gsap.context(() => {
        let orbitPath = MotionPathPlugin.convertToPath("#orbit-1")[0];
        gsap.to("#electron-1-1", {
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