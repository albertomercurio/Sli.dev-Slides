<template>
    <div ref="slideRef" class="slide">
        <SlideTitle tag="h2">
            The Jaynes-Cummings Model
        </SlideTitle>

        <Latex id="hamiltonian" expression="\hat{H} = \omega_c \hat{a}^\dagger \hat{a} + \frac{\omega_{10}}{2} \hat{\sigma}_z + g (\hat{a}^\dagger + \hat{a}) \hat{\sigma}_x" :display="true" class="absolute" />

        <h3 id="question" class="absolute !text-slate-600">
            Where does the Jaynes-Cummings model come from?
        </h3>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { gsap } from 'gsap'

const slideRef = ref(null)
const ctx = gsap.context(() => { }, slideRef.value)

const maxSteps = ref(1); // Maximum steps for the slide
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
            
        timeline.to("#hamiltonian", {
            y: 100,
        })

        timeline.to("#question", {
            autoAlpha: 1,
            y: -50,
        }, "<")

        timeline.addLabel("step-1")
    }, slideRef.value)
})

onUnmounted(() => {
    setTimeout(() => {
        ctx.revert()
    }, 500)
})

function GSAPInitializeElements() {
    gsap.set(["#question", "#hamiltonian"], {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
    })

    gsap.set("#hamiltonian", {
        scale: 1.2,
    })

    gsap.set("#question", {
        autoAlpha: 0,
    })
}

</script>