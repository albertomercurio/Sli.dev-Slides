<template>
    <div ref="slideRef" class="slide">
        <SlideTitle>Effective Mode-Mode Coupling</SlideTitle>

        <img id="cca-mode-mode-effective-coupling" class="absolute" src="/images/plots/cca-mode-mode-effective-coupling.png">
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { preloadImages } from '../src/utils/utils.js'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
gsap.registerPlugin(DrawSVGPlugin)
gsap.registerPlugin(MotionPathPlugin)

const slideRef = ref(null)
const ctx = gsap.context(() => { }, slideRef.value)

onMounted(async () => {
    await preloadImages([
        '/images/plots/cca-mode-mode-effective-coupling.png',
    ])

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
    gsap.set("#cca-mode-mode-effective-coupling", {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        scale: 0.35,
    })
}


</script>