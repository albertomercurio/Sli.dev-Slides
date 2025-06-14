<template>
    <div ref="slideRef" class="slide">
        <SlideTitle tag="h2">
            Cavity QED
        </SlideTitle>

        <BohrAtom ref="atomRef" class="absolute left-1/6 top-1/2 transform -translate-y-1/2" />

        <svg width="300" height="300" viewBox="0 0 4 6" class="absolute right-1/6 top-1/2 transform -translate-y-1/2">
            <line id="energy-0" class="energy-levels" :stroke="energyColors[0]" x1="0" x2="4" y1="1" y2="1" />
            <line id="energy-1" class="energy-levels" :stroke="energyColors[1]" x1="0" x2="4" y1="2" y2="2" />
            <line id="energy-2" class="energy-levels" :stroke="energyColors[2]" x1="0" x2="4" y1="5" y2="5" />

            <g id="energy-dots">
                <circle class="energy-levels" fill="black" cx="2" cy="0.5" r="0.05" />
                <circle class="energy-levels" fill="black" cx="2" cy="0.3" r="0.05" />
                <circle class="energy-levels" fill="black" cx="2" cy="0.1" r="0.05" />
            </g>
        </svg>

        <Latex class="absolute latex-states" expression="\vert 0 \rangle" :display="true" />
        <Latex class="absolute latex-states" expression="\vert 1 \rangle" :display="true" />
        <Latex class="absolute latex-states" expression="\vert 2 \rangle" :display="true" />

    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { gsap } from 'gsap'
import { linrange, getCoordinates, drawSVG, alignObjectsCenterSet } from '../src/utils/utils.js'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
gsap.registerPlugin(DrawSVGPlugin)
gsap.registerPlugin(MotionPathPlugin)

const slideRef = ref(null)
const ctx = gsap.context(() => { }, slideRef.value)

// Energy Levels properties
const energyColors = ["#236B8E", "#83C167", "#E07A5F"]

onMounted(() => {
    ctx.add(() => {
        GSAPInitializeElements()

    }, slideRef.value)
})

onUnmounted(() => {
    setTimeout(() => {
        ctx.revert()
    }, 500)
})

function GSAPInitializeElements() {
    const energies = gsap.utils.toArray(".energy-levels")
    const latexElements = gsap.utils.toArray(".latex-states")

    const point = { x: 4, y: 0 }
    for (let i = 0; i < energies.length; i++) {
        alignObjectsCenterSet(gsap, energies[energies.length - 1 - i], latexElements[i], point, 20)
    }
}


</script>

<style scoped>
.energy-levels {
    stroke-width: 0.1
}
</style>