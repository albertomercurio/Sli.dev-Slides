<template>
    <div ref="slideRef" class="slide">
        <SlideTitle tag="h2">
            The Jaynes-Cummings Model
        </SlideTitle>

        <Latex id="hamiltonian" expression="\hat{H} = \omega_c \hat{a}^\dagger \hat{a} + \frac{\omega_{10}}{2} \hat{\sigma}_z + g (\hat{a} \hat{\sigma}_+ + \hat{a}^\dagger \hat{\sigma}_-)" :display="true" class="absolute" />

        <h3 id="question" class="absolute !text-slate-600">
            Where does the Jaynes-Cummings model come from?
        </h3>

        <Arrow id="arrow-weak-strong" class="absolute" :start="{ x: 200, y: 250 }" :end="{ x: 980-200, y: 250 }" />
        <Latex id="latex-weak" class="absolute latex-formula" expression="g < \gamma" :display="true" />
        <Latex id="latex-strong" class="absolute latex-formula" expression="g > \gamma" :display="true" />

        <Arrow id="arrow-usc-dsc" class="absolute" :start="{ x: 200, y: 400 }" :end="{ x: 980-200, y: 400 }" />
        <Latex id=latex-usc class="absolute latex-formula" expression="g > \frac{\omega_c}{10}" :display="true" />
        <Latex id=latex-dsc class="absolute latex-formula" expression="g > \omega_c" :display="true" />

        <div id="weak-label" class="absolute text-slate-600">
            Weak Coupling
        </div>
        <div id="strong-label" class="absolute text-slate-600">
            Strong Coupling
        </div>

        <div id="usc-label" class="absolute text-slate-600">
            Ultra Strong Coupling
        </div>
        <div id="dsc-label" class="absolute text-slate-600">
            Deep Strong Coupling
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { gsap } from 'gsap'
import { setAlignElementTo } from '../src/utils/utils.js'

const slideRef = ref(null)
const ctx = gsap.context(() => { }, slideRef.value)

const maxSteps = ref(3); // Maximum steps for the slide
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
            y: -140,
        })

        timeline.to(["#latex-weak", "#latex-strong", "#arrow-weak-strong", "#weak-label", "#strong-label"], {
            autoAlpha: 1,
        })

        timeline.addLabel("step-1")

        timeline.to(["#latex-usc", "#latex-dsc", "#arrow-usc-dsc", "#usc-label", "#dsc-label"], {
            autoAlpha: 1,
        })

        timeline.addLabel("step-2")

        timeline.to(["#latex-weak", "#latex-strong", "#arrow-weak-strong", "#weak-label", "#strong-label", "#latex-usc", "#latex-dsc", "#arrow-usc-dsc", "#usc-label", "#dsc-label", "#hamiltonian"], {
            autoAlpha: 0,
        })

        timeline.to("#question", {
            autoAlpha: 1,
        }, "<+0.25")

        timeline.addLabel("step-3")
        
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

    gsap.set("#latex-weak", {
        x: -200,
        y: -75,
    })
    gsap.set("#latex-strong", {
        x: 150,
        y: -75,
    })
    gsap.set("#latex-usc", {
        x: -200,
        y: 60,
    })
    gsap.set("#latex-dsc", {
        x: 150,
        y: 70,
    })

    gsap.set("#weak-label", {
        x: -200,
        y: -130,
    })

    setAlignElementTo("#weak-label", "#latex-weak", [0.5, 0.0], [0.5, 1],)

    setAlignElementTo("#strong-label", "#latex-strong", [0.5, 0.0], [0.5, 1],)

    setAlignElementTo("#usc-label", "#latex-usc", [0.5, 0.0], [0.5, 1],)

    setAlignElementTo("#dsc-label", "#latex-dsc", [0.5, 0.0], [0.5, 1],)

    gsap.set(["#arrow-weak-strong", "#arrow-usc-dsc", "#weak-label", "#strong-label", "#usc-label", "#dsc-label", "#latex-weak", "#latex-strong", "#latex-usc", "#latex-dsc"], {
        autoAlpha: 0,
    })
}

</script>