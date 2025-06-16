<template>
    <div class="slide" ref="slideRef">
        <SlideTitle>Cavity Metamaterial Coupled to a Qubit</SlideTitle>

        <img id="cca-circuit" class="absolute" src="/images/cca-circuit.png">
        <img id="cca-peaks" class="absolute" src="/images/plots/cca-peaks.png">
        <img id="cca-spectrum-alc" class="absolute" src="/images/plots/cca-spectrum-alc.png">
        <img id="cca-coupling-profile" class="absolute" src="/images/plots/cca-coupling-profile.png">
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

const maxSteps = ref(3); // Maximum steps for the slide
const props = defineProps({
  step: { type: Number, required: true }
})
defineExpose({
  maxSteps
});

onMounted(async () => {
    await preloadImages([
        '/images/cca-circuit.png',
        '/images/plots/cca-peaks.png',
        '/images/plots/cca-spectrum-alc.png',
        '/images/plots/cca-coupling-profile.png',
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
            
        timeline.to("#cca-circuit", {
            autoAlpha: 0,
        })

        timeline.fromTo("#cca-peaks", {
            autoAlpha: 0,
        }, {
            autoAlpha: 1,
        })

        timeline.addLabel("step-1")

        timeline.to("#cca-peaks", {
            autoAlpha: 0,
        })

        timeline.fromTo("#cca-spectrum-alc", {
            autoAlpha: 0,
        }, {
            autoAlpha: 1,
        })

        timeline.addLabel("step-2")

        timeline.to("#cca-spectrum-alc", {
            left: "22%",
            scale: 0.24,
        })

        timeline.fromTo("#cca-coupling-profile", {
            x: "+=1200",
        }, {
            x: "-=1000",
        }, "<")

        timeline.addLabel("step-3")
        
    }, slideRef.value)
})

onUnmounted(() => {
    setTimeout(() => {
        ctx.revert()
    }, 500)
})

function GSAPInitializeElements() {
    gsap.set(["#cca-circuit", "#cca-peaks", "#cca-spectrum-alc", "#cca-coupling-profile"], {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
    })

    gsap.set("#cca-circuit", {
        scale: 0.6,
    })
    gsap.set("#cca-peaks", {
        scale: 0.35,
    })
    gsap.set("#cca-spectrum-alc", {
        scale: 0.35,
    })
    gsap.set("#cca-coupling-profile", {
        scale: 0.4,
    })
}


</script>