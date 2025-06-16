<template>
    <div ref="slideRef" class="slide">
        <SlideTitle>Acknowledgements</SlideTitle>

        <img id="daniele-lamberto" class="absolute" src="/images/people/Daniele_Lamberto.jpg">
        <img id="salvatore-savasta" class="absolute" src="/images/people/Salvatore_Savasta.jpg">
        <img id="omar-distefano" class="absolute" src="/images/people/Omar_DiStefano.jpg">
        <img id="vincenzo-savona" class="absolute" src="/images/people/Vincenzo_Savona.jpg">
        <img id="vincent-jouanny" class="absolute" src="/images/people/Vincent_Jouanny.jpg">
        <img id="pasquale-scarlino" class="absolute" src="/images/people/Pasquale_Scarlino.jpg">
        <img id="ltpn-lab" class="absolute" src="/images/people/ltpn-lab.jpg">

        <p id="daniele-lamberto-label" class="absolute text-center text-xs text-gray-500">Daniele Lamberto</p>
        <p id="salvatore-savasta-label" class="absolute text-center text-xs text-gray-500">Salvatore Savasta</p>
        <p id="omar-distefano-label" class="absolute text-center text-xs text-gray-500">Omar Di Stefano</p>
        <p id="vincenzo-savona-label" class="absolute text-center text-xs text-gray-500">Vincenzo Savona</p>
        <p id="vincent-jouanny-label" class="absolute text-center text-xs text-gray-500">Vincent Jouanny</p>
        <p id="pasquale-scarlino-label" class="absolute text-center text-xs text-gray-500">Pasquale Scarlino</p>

    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { preloadImages, setAlignElementTo, runWhenLoaded } from '../src/utils/utils.js'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
gsap.registerPlugin(DrawSVGPlugin)
gsap.registerPlugin(MotionPathPlugin)

const slideRef = ref(null)
const ctx = gsap.context(() => { }, slideRef.value)

const maxSteps = ref(1); // Maximum steps for the slide
const props = defineProps({
  step: { type: Number, required: true }
})
defineExpose({
  maxSteps
});

onMounted(async () => {
    await preloadImages([
        '/images/people/Daniele_Lamberto.jpg',
        '/images/people/Salvatore_Savasta.jpg',
        '/images/people/Omar_DiStefano.jpg',
        '/images/people/Vincenzo_Savona.jpg',
        '/images/people/Vincent_Jouanny.jpg',
        '/images/people/Pasquale_Scarlino.jpg',
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

        timeline.fromTo("#ltpn-lab", {
            autoAlpha: 0,
            width: 100,
        }, {
            autoAlpha: 1,
            width: 480,
        })

        timeline.addLabel("step-1")
    }, slideRef.value)
})

onUnmounted(() => {
    setTimeout(() => {
        ctx.revert()
    }, 500)
})

function GSAPInitializeElements() {
    gsap.set(["#daniele-lamberto", "#salvatore-savasta", "#omar-distefano", "#vincenzo-savona", "#vincent-jouanny", "#pasquale-scarlino"], {
        width: 130,
    })

    gsap.set("#ltpn-lab", {
        top: "46%",
        left: "50%",
        xPercent: -50,
        width: 480,
    })

    gsap.set("#daniele-lamberto", {
        top: "13%",
        left: "10%",
        xPercent: -50,
        // yPercent: -50,
    })

    gsap.set("#salvatore-savasta", {
        top: "13%",
        left: "30%",
        xPercent: -50,
        // yPercent: -50,
    })

    gsap.set("#omar-distefano", {
        top: "50%",
        left: "10%",
        xPercent: -50,
        // yPercent: -50,
    })

    gsap.set("#vincenzo-savona", {
        top: "13%",
        left: "70%",
        xPercent: -50,
        // yPercent: -50,
    })

    gsap.set("#pasquale-scarlino", {
        top: "13%",
        left: "90%",
        xPercent: -50,
        // yPercent: -50,
    })

    gsap.set("#vincent-jouanny", {
        top: "60%",
        left: "90%",
        xPercent: -50,
        // yPercent: -50,
    })

    // setAlignElementTo("#daniele-lamberto-label", "#daniele-lamberto", [0.5, 0.0], [0.5, 1.0])
    // setAlignElementTo("#salvatore-savasta-label", "#salvatore-savasta", [0.5, 0.0], [0.5, 1.0])
    // setAlignElementTo("#omar-distefano-label", "#omar-distefano", [0.5, 0.0], [0.5, 1.0])
    // setAlignElementTo("#vincenzo-savona-label", "#vincenzo-savona", [0.5, 0.0], [0.5, 1.0])
    // setAlignElementTo("#vincent-jouanny-label", "#vincent-jouanny", [0.5, 0.0], [0.5, 1.0])
    // setAlignElementTo("#pasquale-scarlino-label", "#pasquale-scarlino", [0.5, 0.0], [0.5, 1.0])

    runWhenLoaded("#daniele-lamberto", () => {
        setAlignElementTo("#daniele-lamberto-label", "#daniele-lamberto", [0.5, 0.0], [0.5, 1.0])
    })
    runWhenLoaded("#salvatore-savasta", () => {
        setAlignElementTo("#salvatore-savasta-label", "#salvatore-savasta", [0.5, 0.0], [0.5, 1.0])
    })
    runWhenLoaded("#omar-distefano", () => {
        setAlignElementTo("#omar-distefano-label", "#omar-distefano", [0.5, 0.0], [0.5, 1.0])
    })
    runWhenLoaded("#vincenzo-savona", () => {
        setAlignElementTo("#vincenzo-savona-label", "#vincenzo-savona", [0.5, 0.0], [0.5, 1.0])
    })
    runWhenLoaded("#vincent-jouanny", () => {
        setAlignElementTo("#vincent-jouanny-label", "#vincent-jouanny", [0.5, 0.0], [0.5, 1.0])
    })
    runWhenLoaded("#pasquale-scarlino", () => {
        setAlignElementTo("#pasquale-scarlino-label", "#pasquale-scarlino", [0.5, 0.0], [0.5, 1.0])
    })
}

</script>