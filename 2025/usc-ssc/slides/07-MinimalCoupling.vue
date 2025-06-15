<template>
    <div ref="slideRef" class="slide">
        <SlideTitle>
            The Minimal Coupling Replacement
        </SlideTitle>

        <div id="double-well-group" class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 inline-block">
            <div class="relative">
                <svg width="300" height="400" :viewBox="`${doubleWellViewBoxBounds.x} ${doubleWellViewBoxBounds.y} ${doubleWellViewBoxBounds.width} ${doubleWellViewBoxBounds.height}`" id="double-well-svg" class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <path id="double-well-potential" fill="none" d=""/>

                    <path v-for="i in nDoubleWellLevels" :key="`double-well-level-${i-1}`"
                            :id="`double-well-level-${i-1}`"
                            class="double-well-levels"
                            d=""
                            fill="none"/>
                </svg>
                <Latex class="latex-formula absolute top-1/2 right-1/2 transform -translate-y-1/2 -translate-x-[100%] scale-95" expression="V(x) = \alpha x^4 - \beta x^2" :display="true" />
            </div>
        </div>

        <div id="cavity-group" class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 inline-block">
            <div class="relative">
                <CavityMirror class="mirror1 absolute" :size="40" />
                <CavityMirror class="mirror2 absolute" :size="40" />
            </div>
        </div>

        <Latex id="atom-hamiltonian" class="latex-formula absolute bottom-1/8 left-55" expression="\hat{H}_a = \frac{\hat{p}^2}{2m} + V(\hat{x})" :display="true" />
        <Latex id="cavity-hamiltonian" class="latex-formula absolute bottom-1/8 right-55" expression="\hat{H}_c = \omega_c \hat{a}^\dagger \hat{a}" :display="true" />

        <Latex id="total-hamiltonian-1" class="latex-formula total-hamiltonian absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-125" expression="\hat{H}_\mathrm{tot} = \frac{1}{2m}(\hat{p} - q \hat{A})^2 + V(\hat{x}) + \omega_c \hat{a}^\dagger \hat{a}" :display="true" />
        <Latex id="A-term" class="latex-formula total-hamiltonian absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-125" expression="\hat{A} = A_0 (\hat{a} + \hat{a}^\dagger)" :display="true" />
        <Latex id="total-hamiltonian-2" class="latex-formula total-hamiltonian absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-125" expression="\hat{H}_\mathrm{tot} = \frac{\hat{p}^2}{2m} + V(\hat{x}) + \omega_c \hat{a}^\dagger \hat{a} - \frac{q}{m} A_0 \hat{p} (\hat{a} + \hat{a}^\dagger) + \frac{q^2 A_0^2}{2m} (\hat{a} + \hat{a}^\dagger)^2" :display="true" />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { gsap } from 'gsap'
import { drawSVG, alignObjectsCenterSet, doubleWellPotentialFun, linrange, getCoordinates, plotDAttribute } from '../src/utils/utils.js'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
gsap.registerPlugin(DrawSVGPlugin)
gsap.registerPlugin(MotionPathPlugin)

const slideRef = ref(null)
const ctx = gsap.context(() => { }, slideRef.value)

// Double Well SVG Properties
const doubleWellViewBoxBounds = { x: -1.2, y: -1.5, width: 2.4, height: 3.5 }
const nDoubleWellLevels = 5 // Number of energy levels to display
const doubleWellLevelsColors = ["#236B8E", "#83C167", "#E07A5F", "#F4A261", "#2A9D8F"]

// Cavity Mirrors Properties
const mirrorInitialPosition = 80

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

        timeline.to("#double-well-group", {
            scale: 0.8,
            left: "30%",
        })

        timeline.to("#atom-hamiltonian", {
            autoAlpha: 1,
        }, "<")

        timeline.addLabel("step-1")

        timeline.to(["#cavity-group", "#cavity-hamiltonian"], {
            autoAlpha: 1,
        })

        timeline.addLabel("step-2")

        timeline.to(".cavity-mirror", {
            fill: "#00000000",
        })

        timeline.to(".latex-formula", {
            autoAlpha: 0,
        }, "<")

        timeline.to([".mirror1 .cavity-mirror", ".mirror2 .cavity-mirror", ".double-well-levels", "#double-well-potential"], {
            drawSVG: "0%",
            duration: 1,
        })

        timeline.to(["#total-hamiltonian-1", "#A-term"], {
            autoAlpha: 1,
        })

        timeline.addLabel("step-3")

        timeline.to("#A-term", {
            autoAlpha: 0,
        })

        timeline.to("#total-hamiltonian-1", {
            y: -120,
        }, "<")

        timeline.to("#total-hamiltonian-2", {
            autoAlpha: 1,
        }, "<")

        timeline.addLabel("step-4")

    }, slideRef.value)
})

onUnmounted(() => {
    setTimeout(() => {
        ctx.revert()
    }, 500)
})

function GSAPInitializeElements() {
    const xList = linrange(doubleWellViewBoxBounds.x, doubleWellViewBoxBounds.x + doubleWellViewBoxBounds.width, 50)
    const doubleWellPotentialPath = gsap.utils.toArray("#double-well-potential")[0]
    plotDAttribute(doubleWellPotentialPath, xList, doubleWellPotentialFun, doubleWellViewBoxBounds)

    const levels = [-0.9, -0.6, 0.4, 1.3, 2.5]
    for (let i = 0; i < nDoubleWellLevels; i++) {
        let path = gsap.utils.toArray(`#double-well-level-${i}`)[0]
        let yLevel = levels[i]
        let f = (x) => { return yLevel }
        plotDAttribute(path, xList, f, doubleWellViewBoxBounds)
        path.setAttribute("stroke", doubleWellLevelsColors[i])
    }

    gsap.set("#cavity-group", {
        left: "70%",
    })

    gsap.set(".mirror1", {
        x: -mirrorInitialPosition,
        left: "50%",
        top:  "50%",
        xPercent: -50,
        yPercent: -50
    })

    gsap.set(".mirror2", {
        x: mirrorInitialPosition,
        left: "50%",
        top:  "50%",
        xPercent: -50,
        yPercent: -50,
        rotation: 180,
    })

    gsap.set(["#atom-hamiltonian", "#cavity-hamiltonian", "#cavity-group", ".total-hamiltonian"], {
        autoAlpha: 0,
    })

    gsap.set("#A-term", {
        y: 80,
    })
}

</script>

<style scoped>
#double-well-potential {
    stroke: #475569; /* Equivalent to Tailwind's slate-600 color */
    stroke-width: 0.02;
}

.double-well-levels {
    stroke-width: 0.05;
}
</style>