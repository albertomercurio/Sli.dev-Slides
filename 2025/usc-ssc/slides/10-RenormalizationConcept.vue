<template>
    <div ref="slideRef" class="slide">
        <SlideTitle>Renormalization of the Low-Energy Model</SlideTitle>

            <svg width="300" height="400" :viewBox="`${doubleWellViewBox.x-0.2} ${doubleWellViewBox.y} ${doubleWellViewBox.width+0.4} ${doubleWellViewBox.height}`" id="double-well-svg" class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <path id="double-well-potential" fill="none" d=""/>

                <!-- Rectangle with rounded corners to embed level-0 and level-1 -->
                <rect id="low-energy-box" 
                      x="-1.4" 
                      y="0.8" 
                      width="2.8" 
                      height="0.9"
                      rx="0.1" 
                      ry="0.1" 
                      fill="none" 
                      stroke="#3B82F6" 
                      stroke-width="0.03" 
                      stroke-dasharray="0.05, 0.05" />

                <path v-for="i in nDoubleWellLevels" :key="`double-well-level-${i-1}`"
                        :id="`double-well-level-${i-1}`"
                        class="double-well-levels"
                        d=""
                        fill="none"/>

                <line id="dashed-level" x1="-1.2" x2="1.2" y1="0.5" y2="0.5" stroke-dasharray="0.05, 0.05" stroke-width="0.04" stroke="#475569" />
            </svg>

            <Arrow id="arrow-wc" :start="arrowCoordinates.start" :end="arrowCoordinates.end" />
            <Arrow id="arrow-wc-2" :start="arrowCoordinates2.start" :end="arrowCoordinates2.end" />

            <Latex id="wc-expression" class="latex-formula absolute" expression="\omega_c" :display="true" />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { linrange, getDistance, setAlignElementTo, plotDAttribute, doubleWellPotentialFun } from '../src/utils/utils.js'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
gsap.registerPlugin(DrawSVGPlugin)
gsap.registerPlugin(MotionPathPlugin)

const slideRef = ref(null)
const ctx = gsap.context(() => { }, slideRef.value)
const renormalizationSVG = ref(null)

// Double Well SVG Properties
const doubleWellViewBox = { x: -1.3, y: -1.5, width: 2.6, height: 3.5 }
const nDoubleWellLevels = 5 // Number of energy levels to display
const doubleWellLevelsColors = ["#236B8E", "#83C167", "#E07A5F", "#F4A261", "#2A9D8F"]

// Arrow Properties
const arrowCoordinates = ref({
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 }
})
const arrowCoordinates2 = ref({
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 }
})

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
            paused: false,
            defaults: {
                duration: 0.5,
                ease: "power2.inOut"
            }
        })

        watch(() => props.step, newStep => {
            const tweenOld = `step-${newStep-1}`
            const tweenNew = `step-${newStep}`
            // Use tweenTo for smooth forward *and* backward motion
            if (newStep > 0 && newStep <= maxSteps.value) {
                timeline.tweenFromTo(tweenOld, tweenNew);
            }
        });

        timeline.to(["#double-well-potential", ".double-well-levels"], {
            drawSVG: "100%",
            duration: 1,
            stagger: 0.2,
        })

        timeline.addPause()

        timeline.addLabel("step-0")

        timeline.to(["#arrow-wc", "#wc-expression"], {
            autoAlpha: 1,
        })

        timeline.addLabel("step-1")

        timeline.to("#arrow-wc-2", {
            autoAlpha: 1,
            duration: 1,
        })
        
        timeline.to("#wc-expression", {
            y: -2,
            duration: 1,
        }, "<")

        timeline.to("#dashed-level", {
            autoAlpha: 1,
        })

        timeline.to(["#double-well-level-2", "#double-well-level-3"], {
            scale: 2.5,
            stroke: "#FFFF00",
            yoyo: true,
            repeat: 1,
            duration: 0.75,
        })

        timeline.addLabel("step-2")

        timeline.to("#low-energy-box", {
            autoAlpha: 1,
            duration: 1,
        })

        timeline.to(["#arrow-wc", "#arrow-wc-2", "#wc-expression"], {
            autoAlpha: 0,
        }, "<")

        timeline.to("#low-energy-box", {
            attr: {
                fill: "#3B82F670",
            },
        })

        timeline.addLabel("step-3")

        timeline.to(["#double-well-level-2", "#double-well-level-3"], {
            y: (item) => {
                return item === 0 ? 1.3 : 1.9
            },
            duration: 1,
        })

        timeline.to(["#double-well-level-2", "#double-well-level-3"], {
            autoAlpha: 0,
            duration: 1,
        }, "<+0.5")

        timeline.call(() => {
            gsap.to(["#double-well-level-0", "#double-well-level-1"], {
                scale: 1.5,
                stroke: "#FFFF00",
                duration: 0.5,
                yoyo: true,
                repeat: -1,
            })
        })

        timeline.addLabel("step-4")

    }, slideRef.value)
})

onUnmounted(() => {
    setTimeout(() => {
        ctx.revert()
    }, 500)
})

function GSAPInitializeElements() {
    const xList = linrange(doubleWellViewBox.x, doubleWellViewBox.x + doubleWellViewBox.width, 50)
    const doubleWellPotentialPath = gsap.utils.toArray("#double-well-potential")[0]
    plotDAttribute(doubleWellPotentialPath, xList, doubleWellPotentialFun, doubleWellViewBox)

    const levels = [-0.9, -0.6, 0.4, 1.3, 2.5]
    for (let i = 0; i < nDoubleWellLevels; i++) {
        let path = gsap.utils.toArray(`#double-well-level-${i}`)[0]
        let yLevel = levels[i]
        let f = (x) => { return yLevel }
        plotDAttribute(path, xList, f, doubleWellViewBox)
        path.setAttribute("stroke", doubleWellLevelsColors[i])
    }

    const arrow = gsap.utils.toArray("#arrow-wc")[0]
    const level0 = gsap.utils.toArray(`#double-well-level-0`)[0]
    const level1 = gsap.utils.toArray(`#double-well-level-1`)[0]
    const level2 = gsap.utils.toArray(`#double-well-level-2`)[0]
    const point_level1 = MotionPathPlugin.convertCoordinates(level1, arrow, { x: doubleWellViewBox.width + 0.1, y: +0.01 })
    const point_level0 = MotionPathPlugin.convertCoordinates(level0, arrow, { x: doubleWellViewBox.width + 0.1, y: -0.01 })
    const point_level2 = MotionPathPlugin.convertCoordinates(level2, arrow, { x: doubleWellViewBox.width + 0.1, y: +0.4 })

    arrowCoordinates.value.start = point_level1
    arrowCoordinates.value.end = point_level0

    arrowCoordinates2.value.start = point_level2
    arrowCoordinates2.value.end = point_level0

    setAlignElementTo("#wc-expression", ["#double-well-level-0", "#double-well-level-1"], [0.0, 0.5], [1.1, 0.5]);

    gsap.set(["#double-well-potential", ".double-well-levels"], {
        drawSVG: "0%",
    })

    gsap.set(["#arrow-wc", "#arrow-wc-2", "#wc-expression", "#dashed-level", "#low-energy-box"], {
        autoAlpha: 0,
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

