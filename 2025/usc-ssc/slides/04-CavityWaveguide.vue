<template>
    <div ref="slideRef" class="slide">
        <SlideTitle tag="h2">
        Superconducting Waveguide Resonator
        </SlideTitle>

        <!-- Waveguide SVG -->
        <svg id="waveguide-svg" class="absolute" :width="waveguideSVGWidth" :height="waveguideSVGHeight" :viewBox="waveguideSVGviewBox">
            <rect class="superconductor" :x="-waveguideLength / 2" :y="-waveguideWidth / 2" :width="waveguideLength" :height="waveguideWidth" />
            <rect class="superconductor" :x="-waveguideSVGWidth / 2" :y="-waveguideWidth / 2" :width="(waveguideSVGWidth - waveguideLength) / 2 - waveguideGap" :height="waveguideWidth" />
            <rect class="superconductor" :x="waveguideLength / 2 + waveguideGap" :y="-waveguideWidth / 2" :width="(waveguideSVGWidth - waveguideLength) / 2 - waveguideGap" :height="waveguideWidth" />
            <rect class="superconductor" :x="-waveguideSVGWidth / 2" :y="-waveguideSVGHeight / 2" :width="waveguideSVGWidth" :height="(waveguideSVGHeight - waveguideWidth - waveguideGapGround) / 2" />
            <rect class="superconductor" :x="-waveguideSVGWidth / 2" :y="waveguideSVGHeight / 2 - (waveguideSVGHeight - waveguideWidth - waveguideGapGround) / 2" :width="waveguideSVGWidth"    :height="(waveguideSVGHeight - waveguideWidth - waveguideGapGround) / 2" />
        </svg>

        <EmptySVG v-for="i in nCavityModes" ref="cavityModeRefs" :key="`mode-${i}`"
      :width="waveguideSVGWidth" :height="waveguideSVGHeight" :viewBox="waveguideSVGviewBox"
        class="cavity-mode absolute" />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { gsap } from 'gsap'
import { linrange, getCoordinates } from '../src/utils/utils.js'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
gsap.registerPlugin(DrawSVGPlugin)
gsap.registerPlugin(MotionPathPlugin)

const slideRef = ref(null)
const cavityModeRefs = ref([])
const ctx = gsap.context(() => {}, slideRef.value)

// Waveguide SVG Properties
const waveguideSVGWidth = 500
const waveguideSVGHeight = 300
const waveguideSVGviewBox = `${-waveguideSVGWidth / 2} ${-waveguideSVGHeight / 2} ${waveguideSVGWidth} ${waveguideSVGHeight}`
const waveguideLength = waveguideSVGWidth * 4 / 5
const waveguideWidth = 20
const waveguideGap = 20
const waveguideGapGround = 40
const waveguideColor = "#666"

// Waveguide Modes Parameters
const nCavityModes = 3
const modeColors = ['#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51', '#A8DADC', '#457B9D'];

onMounted(() => {
    ctx.add(() => {
        GSAPInitializeElements()
        const modePaths = initializeCavityModes(nCavityModes, waveguideSVGWidth, waveguideSVGHeight, modeColors)

        const timeline = gsap.timeline({ 
            paused: false,
            defaults: {
                duration: 0.5,
                ease: "power1.inOut",
            }
        });

        timeline.to(".superconductor", {
            drawSVG: "100%",
            stagger: 0.1
        })

        timeline.to(".superconductor", {
            attr: {
                fill: waveguideColor
            },
        })

        timeline.to(modePaths, {
            drawSVG: "100%",
            stagger: 0.4
        })

    }, slideRef.value)
})

onUnmounted(() => {
  setTimeout(() => {
    ctx.revert()
  }, 500)
})

function GSAPInitializeElements() {
    gsap.set("#waveguide-svg", {
        left: "50%",
        top:  "50%",
        xPercent: -50,
        yPercent: -50,
    })

    gsap.set(".cavity-mode", {
        left: "50%",
        top:  "50%",
        xPercent: -50,
        yPercent: -50,
    })

    gsap.set(".superconductor", {
        drawSVG: "0%",
        attr: {
            fill: "#00000000"
        },
    })
}

function initializeCavityModes(nCavityModes, waveguideSVGWidth, waveguideSVGHeight, modeColors) {
  const xList = linrange(-waveguideSVGWidth/2, waveguideSVGWidth/2, 30);
  const kList = Array.from({ length: nCavityModes }, (_, i) => (i + 1) * Math.PI / waveguideSVGWidth);
  const fList = kList.map(k => x => waveguideSVGHeight * Math.sin(k * (x - waveguideSVGWidth / 2)) / 3);

  const modePaths = cavityModeRefs.value.map((ref) => ref.pathRef);

  const coordinatesList = fList.map(f => getCoordinates(f, xList));
  const rawPathList = coordinatesList.map(coords => MotionPathPlugin.arrayToRawPath(coords));
  const dList = rawPathList.map(rawPath => MotionPathPlugin.rawPathToString(rawPath));

  gsap.set(modePaths, {
    drawSVG: "0%",
    attr: {
      d: (i) => {return dList[i]},
      stroke: (i) => {return modeColors[i % modeColors.length]},
    },
    strokeWidth: 3,
  })

  return modePaths
}

</script>

<style scoped>
.superconductor {
    stroke: #777;
    stroke-width: 2;
}
</style>