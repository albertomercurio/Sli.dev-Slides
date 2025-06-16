<template>
    <div class="slide" ref="slideRef">
        <SlideTitle>Cavity Metamaterial Coupled to a Qubit</SlideTitle>

        <CavityMirror v-for="i in totalCavities" :key="`cavity-mirror-left-${i}`" 
                        :id="`cavity-mirror-left-${i}`"
                        class="absolute cavity-mirror-left"
                        :size="30" />
        <CavityMirror v-for="i in totalCavities" :key="`cavity-mirror-right-${i}`" 
                        :id="`cavity-mirror-right-${i}`"
                        class="absolute cavity-mirror-right"
                        :size="30" />

        <!-- Curved Arrows-->
        <CurvedDoubleArrow v-for="i in (totalCavities-1)" :key="`curved-arrow-${i}`"
                :id="`curved-arrow-${i}`"
                class="absolute hopping-arrows" />

        <Latex v-for="i in (totalCavities-1)" :key="`latex-hopping-${i}`"
                :id="`latex-hopping-${i}`"
                class="absolute latex-formula latex-hopping"
                :expression="`J_{${i % 2 === 0 ? '2' : '1'}}`"
                :display="true" />

        <!-- SSH Eigenvalues Image -->
        <img id="ssh-eigenvalues" class="absolute" src="/images/plots/ssh-eigenvalues.png">

        <!-- Atom -->
        <BohrAtom id="atom" class="absolute" :size="150" />
        <CurvedDoubleArrow id="curved-arrow-atom-left" class="absolute" /> 
        <CurvedDoubleArrow id="curved-arrow-atom-right" class="absolute" />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { getCoordinates, setAlignElementTo, drawSVG, preloadImages } from '../src/utils/utils.js'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
gsap.registerPlugin(DrawSVGPlugin)
gsap.registerPlugin(MotionPathPlugin)

const slideRef = ref(null)
const ctx = gsap.context(() => { }, slideRef.value)

// Cavity Mirrors Parameters
const totalCavities = 5


const maxSteps = ref(2); // Maximum steps for the slide
const props = defineProps({
  step: { type: Number, required: true }
})
defineExpose({
  maxSteps
});


onMounted(async () => {
    await preloadImages([
        "/images/plots/ssh-eigenvalues.png",
    ])
    ctx.add(() => {
        const mirrorColor = gsap.getProperty(".cavity-mirror-left  .cavity-mirror", "fill")
        GSAPInitializeElements()

        const timeline = gsap.timeline({
            paused: false,
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

        drawSVG(
            timeline,
            [".cavity-mirror-left .cavity-mirror", ".cavity-mirror-right .cavity-mirror"],
            mirrorColor,
            "100%",
            0.1
        )

        timeline.fromTo([".hopping-arrows", ".latex-hopping"], {
            autoAlpha: 0,
        }, {
            autoAlpha: 1,
        })

        timeline.addPause()
        timeline.addLabel("step-0")

        timeline.fromTo("#ssh-eigenvalues", {
            autoAlpha: 0,
            scale: 0.1,
        }, {
            autoAlpha: 1,
            scale: 0.28,
        })

        timeline.addLabel("step-1")

        timeline.to("#ssh-eigenvalues", {
            autoAlpha: 0,
            scale: 0.1,
        })
        timeline.fromTo("#atom", {
            autoAlpha: 0,
            scale: 0.3,
        }, {
            autoAlpha: 1,
            scale: 1,
        })
        timeline.fromTo(["#curved-arrow-atom-left", "#curved-arrow-atom-right"], {
            autoAlpha: 0,
        }, {
            autoAlpha: 1,
        })

        timeline.addLabel("step-2")


    }, slideRef.value)
})

onUnmounted(() => {
    setTimeout(() => {
        ctx.revert()
    }, 500)
})

function GSAPInitializeElements() {
    // Coupled Cavity Array Initialization

    gsap.set(".cavity-mirror-left", {
        x: (i) => {
            return -460 + (i * 200)
        },
        y: "-= 120",
    })

    gsap.set(".cavity-mirror-right", {
        x: (i) => {
            return -360 + (i * 200)
        },
        y: "-= 120",
        rotation: 180,
    })

    gsap.set([".cavity-mirror-left .cavity-mirror", ".cavity-mirror-right .cavity-mirror"], {
        drawSVG: "0%",
        fill: "#00000000",
    })

    // Curved Arrows Initialization

    gsap.set(".hopping-arrows", {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        x: (i) => {
            return -300 + (i * 200)
        },
        y: -150,
    })

    gsap.set(".latex-hopping", {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        x: (i) => {
            return -300 + (i * 200)
        },
        y: -180,
    })

    // SSH Eigenvalues Initialization

    gsap.set("#ssh-eigenvalues", {
        top: "70%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
    })

    // Atom Initialization

    gsap.set("#atom", {
        top: "57%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
    })

    gsap.set(["#curved-arrow-atom-left", "#curved-arrow-atom-right"], {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        rotation: (i) => {
            return i === 0 ? 220 : -220
        },
        x: (i) => {
            return i === 0 ? -150 : 150
        },
        y: 30,
        scale: 0.7,
    })
}

</script>