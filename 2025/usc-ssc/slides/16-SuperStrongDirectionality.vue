<template>
    <div ref="slideRef" class="slide">
        <SlideTitle>Mode Localization</SlideTitle>

        <img id="cca-circuit" class="absolute" src="/images/cca-circuit.png">
        <Arrow id="arrow-input-left" class="absolute" :start="{ x: 100, y: 100 }" :end="{ x: 200, y: 100 }" />
        <Arrow id="arrow-output-left" class="absolute" :start="{ x: 200, y: 120 }" :end="{ x: 100, y: 120 }" />
        <Arrow id="arrow-input-right" class="absolute" :start="{ x: 880, y: 100 }" :end="{ x: 780, y: 100 }" />
        <Arrow id="arrow-output-right" class="absolute" :start="{ x: 780, y: 120 }" :end="{ x: 880, y: 120 }" />

        <Latex id="s-ll" class="absolute" expression="\vert S_\mathrm{LL} \vert" :display="true" />
        <Latex id="s-rr" class="absolute" expression="\vert S_\mathrm{RR} \vert" :display="true" />

        <img id="cca-localization-sketch" class="absolute" src="/images/plots/cca-localization-sketch.png">
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { preloadImages, setAlignElementTo } from '../src/utils/utils.js'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
gsap.registerPlugin(DrawSVGPlugin)
gsap.registerPlugin(MotionPathPlugin)

const slideRef = ref(null)
const ctx = gsap.context(() => { }, slideRef.value)


const maxSteps = ref(6); // Maximum steps for the slide
const props = defineProps({
  step: { type: Number, required: true }
})
defineExpose({
  maxSteps
});


onMounted(async () => {
    await preloadImages([
        '/images/cca-circuit.png',
        '/images/plots/cca-localization-sketch.png',
    ])

    ctx.add(() => {
        GSAPInitializeElements()

        const timeline = gsap.timeline({
            paused: true,
            defaults: {
                duration: 0.5,
                ease: "power2.inOut",
            },
        })

        watch(() => props.step, newStep => {
            const tweenOld = `step-${newStep-1}`
            const tweenNew = `step-${newStep}`
            // Use tweenTo for smooth forward *and* backward motion
            if (newStep > 0 && newStep <= maxSteps.value) {
                timeline.tweenFromTo(tweenOld, tweenNew);
            }
        });

        timeline.addLabel("step-0")

        timeline.fromTo("#arrow-input-left", {
            autoAlpha: 0,
        }, {
            autoAlpha: 1,
        })

        timeline.addLabel("step-1")

        timeline.fromTo("#arrow-output-left", {
            autoAlpha: 0,
        }, {
            autoAlpha: 1,
        })

        timeline.fromTo("#s-ll", {
            autoAlpha: 0,
        }, {
            autoAlpha: 1,
        })

        timeline.addLabel("step-2")

        timeline.fromTo("#arrow-input-right", {
            autoAlpha: 0,
        }, {
            autoAlpha: 1,
        })

        timeline.addLabel("step-3")

        timeline.fromTo("#arrow-output-right", {
            autoAlpha: 0,
        }, {
            autoAlpha: 1,
        })

        timeline.fromTo("#s-rr", {
            autoAlpha: 0,
        }, {
            autoAlpha: 1,
        })

        timeline.addLabel("step-4")

        timeline.to(["#arrow-input-left", "#arrow-output-left", "#s-ll", "#arrow-input-right", "#arrow-output-right", "#s-rr"], {
            autoAlpha: 0,
        })

        timeline.to("#cca-circuit", {
            left: "20%",
            scale: 0.3,
        })

        timeline.fromTo("#cca-localization-sketch", {
            x: "+=1200",
        }, {
            x: "-=1000",
        }, "<")

        timeline.addLabel("step-6")

    }, slideRef.value)
})

onUnmounted(() => {
    setTimeout(() => {
        ctx.revert()
    }, 500)
})

function GSAPInitializeElements() {
    gsap.set(["#cca-circuit", "#cca-localization-sketch"], {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        scale: 0.55,
    })

    gsap.set("#s-ll", {
        x: -350,
        y: -160,
    })
    gsap.set("#s-rr", {
        x: 330,
        y: -160,
    })
}


</script>