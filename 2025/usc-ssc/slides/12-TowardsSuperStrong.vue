<template>
    <div ref="slideRef" class="slide">
        <SlideTitle>Towards Super Strong Coupling</SlideTitle>

        <Arrow id="arrow-weak-strong" class="absolute" :start="{ x: 200, y: 150 }" :end="{ x: 980-200, y: 150 }" />
        <Latex id="latex-weak" class="absolute latex-formula" expression="g < \gamma" :display="true" />
        <Latex id="latex-strong" class="absolute latex-formula" expression="g > \gamma" :display="true" />

        <Arrow id="arrow-usc-dsc" class="absolute" :start="{ x: 200, y: 270 }" :end="{ x: 980-200, y: 270 }" />
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

        <Arrow id="arrow-ssc" class="absolute" :start="{ x: 200, y: 400 }" :end="{ x: 980-200, y: 400 }" />

        <Latex id="latex-ssc" class="absolute latex-formula" expression="g > \Delta \omega" :display="true" />

        <div id="ssc-label" class="absolute text-slate-600">
            Super Strong Coupling
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { linrange, getDistance, setAlignElementTo, preloadImages } from '../src/utils/utils.js'
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

        timeline.fromTo([
            "#arrow-weak-strong",
            "#latex-weak",
            "#latex-strong",
            "#weak-label",
            "#strong-label"
        ], {
            autoAlpha: 0,
            x: "-= 1200",
        }, {
            autoAlpha: 1,
            x: "+= 1200",
        })

        timeline.addLabel("step-1")

        timeline.fromTo([
            "#arrow-usc-dsc",
            "#latex-usc",
            "#latex-dsc",
            "#usc-label",
            "#dsc-label"
        ], {
            autoAlpha: 0,
            x: "-= 1200",
        }, {
            autoAlpha: 1,
            x: "+= 1200",
        })

        timeline.addLabel("step-2")

        timeline.fromTo([
            "#arrow-ssc",
            "#latex-ssc",
            "#ssc-label"
        ], {
            autoAlpha: 0,
            x: "-= 1200",
        }, {
            autoAlpha: 1,
            x: "+= 1200",
        })

        timeline.addLabel("step-3")

    }, slideRef.value)
})

onUnmounted(() => {
    setTimeout(() => {
        ctx.revert()
    }, 500)
})

function GSAPInitializeElements() {
    gsap.set("#latex-weak", {
        x: -200,
        y: -175,
    })
    gsap.set("#latex-strong", {
        x: 150,
        y: -175,
    })
    gsap.set("#latex-usc", {
        x: -200,
        y: 60-130,
    })
    gsap.set("#latex-dsc", {
        x: 150,
        y: 70-130,
    })

    gsap.set("#weak-label", {
        x: -200,
        y: -130,
    })
    
    gsap.set("#latex-ssc", {
        x: -30,
        y: 70,
    })

    setAlignElementTo("#weak-label", "#latex-weak", [0.5, 0.0], [0.5, 1],)

    setAlignElementTo("#strong-label", "#latex-strong", [0.5, 0.0], [0.5, 1],)

    setAlignElementTo("#usc-label", "#latex-usc", [0.5, 0.0], [0.5, 1],)

    setAlignElementTo("#dsc-label", "#latex-dsc", [0.5, 0.0], [0.5, 1],)

    setAlignElementTo("#ssc-label", "#latex-ssc", [0.5, 0.0], [0.5, 1],)
}

</script>