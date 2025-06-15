<template>
    <div ref="slideRef" class="slide">
        <SlideTitle tag="h2">
            Cavity QED
        </SlideTitle>

        <BohrAtom ref="atomRef" class="atom absolute left-1/6 top-1/2 transform -translate-y-1/2" />

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

        <Arrow class="arrow-0 arrows" :start="arrowCoordinates[0].start" :end="arrowCoordinates[0].end" />
        <Arrow class="arrow-1 arrows" :start="arrowCoordinates[1].start" :end="arrowCoordinates[1].end" />

        <Latex class="absolute latex-states energy-0" expression="\vert 0 \rangle" :display="true" />
        <Latex class="absolute latex-states energy-1" expression="\vert 1 \rangle" :display="true" />
        <Latex class="absolute latex-states energy-2" expression="\vert 2 \rangle" :display="true" />
        <Latex class="absolute arrows latex-arrows arrow-0" expression="\omega_{10}" :display="true" />
        <Latex class="absolute arrows latex-arrows arrow-1" expression="\omega_{21}" :display="true" />

        <CavityMirror class="mirror1 absolute" :size="80" />
        <CavityMirror class="mirror2 absolute" :size="80" />
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
const atomRef = ref(null)

// Energy Levels properties
const energyColors = ["#236B8E", "#83C167", "#E07A5F"]
const arrowCoordinates = ref(Array.from({ length: 2 }, (_, i) => ({
    start: { x: 0, y: 0 },
    end: { x: 20, y: 40 }
})))

//  Mirrors Properties
const mirrorInitialPosition = 300

const maxSteps = ref(8); // Maximum steps for the slide
const props = defineProps({
  step: { type: Number, required: true }
})
defineExpose({
  maxSteps
});

onMounted(() => {
    ctx.add(() => {
        const mirrorFill = gsap.getProperty('.mirror1 .cavity-mirror', 'fill')

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

        timeline.to(".arrow-0", {
            autoAlpha: 1, 
        })

        timeline.addLabel('step-5')

        timeline.to(".arrow-1", {
            autoAlpha: 1, 
        })

        timeline.addLabel('step-6')

        timeline.to([".arrow-1", ".energy-2", ".energy-dots"], {
            autoAlpha: 0.2,
        })

        timeline.addLabel('step-7')

        timeline.to([".arrows", ".energy-levels", ".latex-states", ".energy-dots"], {
            autoAlpha: 0,
        })

        timeline.to(atomRef.value.rootRef, {
            top: "50%",
            left: "50%",
            xPercent: -50,
        }, "<")

        drawSVG(
            timeline,
            [".mirror1 .cavity-mirror", ".mirror2 .cavity-mirror"],
            mirrorFill,
            "100%",
            0.0,
            {
                x: 2*mirrorInitialPosition,
                duration: 1
            }
        )

        timeline.addLabel('step-8')

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

        if (i > 0) {
            let arrow = gsap.utils.toArray(`.arrow-${i-1}`)[0]
            let fromElementEnd = gsap.utils.toArray(`.energy-levels.energy-${i-1}`)[0]
            let pointStart = MotionPathPlugin.convertCoordinates(fromElement, arrow, { x: -0.1, y: +0.1 })
            let pointEnd = MotionPathPlugin.convertCoordinates(fromElementEnd, arrow, { x: -0.1, y: +-.1 })

            arrowCoordinates.value[i-1].start = pointStart
            arrowCoordinates.value[i-1].end = pointEnd

            let latexArrow = gsap.utils.toArray(`.latex-arrows.arrow-${i-1}`)[0]
            alignObjectsCenterSet(gsap, arrow, latexArrow, { x: pointStart.x - 30, y: (pointStart.y + pointEnd.y) / 2}, 20)

            gsap.set(latexArrow, {
                xPercent: -100,
                yPercent: -50,
            })
        }
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
    gsap.set('.arrows', {
        autoAlpha: 0,
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

    gsap.set([".mirror1 .cavity-mirror", ".mirror2 .cavity-mirror"], {
        drawSVG: "0%",
        fill: "#00000000",
    })
}


</script>

<style scoped>
.energy-levels {
    stroke-width: 0.1
}
</style>