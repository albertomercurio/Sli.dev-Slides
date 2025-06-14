<template>
    <div ref="slideRef" class="slide">
        <SlideTitle tag="h2">
            Cavity QED
        </SlideTitle>

        <BohrAtom ref="atomRef" class="absolute left-1/6 top-1/2 transform -translate-y-1/2" />

        <svg width="300" height="300" viewBox="0 0 4 6" class="absolute right-1/6 top-1/2 transform -translate-y-1/2">
            <line class="energy-levels energy-2" :stroke="energyColors[0]" x1="0" x2="4" y1="1" y2="1" />
            <line class="energy-levels energy-1" :stroke="energyColors[1]" x1="0" x2="4" y1="4" y2="4" />
            <line class="energy-levels energy-0" :stroke="energyColors[2]" x1="0" x2="4" y1="5" y2="5" />

            <g class="energy-dots">
                <circle fill="black" cx="2" cy="0.5" r="0.05" />
                <circle fill="black" cx="2" cy="0.3" r="0.05" />
                <circle fill="black" cx="2" cy="0.1" r="0.05" />
            </g>
        </svg>

        <Latex class="absolute latex-states energy-0" expression="\vert 0 \rangle" :display="true" />
        <Latex class="absolute latex-states energy-1" expression="\vert 1 \rangle" :display="true" />
        <Latex class="absolute latex-states energy-2" expression="\vert 2 \rangle" :display="true" />

        <div class="absolute top-1/4 left-1/3 w-16 h-16 bg-red-500 ciaone">
            
        </div>
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

const maxSteps = ref(4); // Maximum steps for the slide
const props = defineProps({
  step: { type: Number, required: true }
})
defineExpose({
  maxSteps
});

onMounted(() => {
    ctx.add(() => {
        GSAPInitializeElements()

        const timeline = gsap.timeline({ 
            paused: true,
            defaults: {
                duration: 0.5,
                ease: "power1.inOut",
            }
        });

        watch(() => props.step, newStep => {
            const tweenOld = `step-${newStep-1}`
            const tweenNew = `step-${newStep}`
            // Use tweenTo for smooth forward *and* backward motion
            if (newStep > 0 && newStep <= maxSteps.value) {
                timeline.tweenFromTo(tweenOld, tweenNew);
            }
        });

        timeline.addLabel('step-0')
        
        timeline.to(".energy-0", {
            autoAlpha: 1, 
        })

        timeline.addLabel('step-1')

        timeline.to(".energy-1", {
            autoAlpha: 1, 
        })

        timeline.addLabel('step-2')

        timeline.to(".energy-2", {
            autoAlpha: 1, 
        })

        timeline.addLabel('step-3')

        timeline.to(".energy-dots", {
            autoAlpha: 1, 
        })

        timeline.addLabel('step-4')

    }, slideRef.value)
})

onUnmounted(() => {
    setTimeout(() => {
        ctx.revert()
    }, 500)
})

function GSAPInitializeElements() {
    for (let i = 0; i < 3; i++) {
        let fromElement = gsap.utils.toArray(`.energy-levels.energy-${i}`)[0]
        let toElement = gsap.utils.toArray(`.latex-states.energy-${i}`)[0]
        
        alignObjectsCenterSet(gsap, fromElement, toElement, { x: 4, y: 0 }, 20)
    }

    gsap.set('.energy-levels', {
        autoAlpha: 0,
    })
    gsap.set('.latex-states', {
        autoAlpha: 0,
    })
    gsap.set('.energy-dots', {
        autoAlpha: 0,
    })
}


</script>

<style scoped>
.energy-levels {
    stroke-width: 0.1
}
</style>