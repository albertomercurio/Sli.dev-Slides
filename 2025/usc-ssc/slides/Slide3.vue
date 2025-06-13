<template>
  <div ref="slideRef" class="slide">
    <CavityMirror ref="mirror1Ref" class="mirror1 absolute" :size="80" />
    <CavityMirror ref="mirror2Ref" class="mirror2 absolute" :size="80" />
    <EmptySVG v-for="i in nCavityModes" ref="cavityModeRefs" :key="`mode-${i}`"
    :width="modeSVGWidth" :height="modeSVGHeight"
      class="cavity-mode absolute" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import CavityMirror from '../src/components/CavityMirror.vue'
import EmptySVG from '../src/components/EmptySVG.vue'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
gsap.registerPlugin(DrawSVGPlugin)
gsap.registerPlugin(MotionPathPlugin)

const mirror1Ref = ref(null)
const mirror2Ref = ref(null)
const slideRef = ref(null)
const cavityModeRefs = ref([])
const ctx = gsap.context(() => {}, slideRef.value)

// Cavity Mirrors Parameters
const mirrorInitialPosition = 300

// Cavity Modes Parameters
const nCavityModes = 3
const modeSVGWidth = 432
const modeSVGHeight = 250
const modeColors = ['#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51', '#A8DADC', '#457B9D'];

const maxSteps = ref(1); // Maximum steps for the slide
const props = defineProps({
  step: { type: Number, required: true }
})
defineExpose({
  maxSteps
});

onMounted(() => {
  ctx.add(() => {
    const color_mirror1 = gsap.getProperty(".mirror1 .cavity-mirror", "fill")
    const color_mirror2 = gsap.getProperty(".mirror2 .cavity-mirror", "fill")

    const timeline = gsap.timeline({ paused: true });

    watch(() => props.step, newStep => {
      const tweenOld = `step-${newStep-1}`
      const tweenNew = `step-${newStep}`
      // Use tweenTo for smooth forward *and* backward motion
      if (newStep > 0 && newStep <= maxSteps.value) {
        timeline.tweenFromTo(tweenOld, tweenNew);
      }
    });

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

    gsap.set(".cavity-mode", {
      left: "50%",
      top:  "50%",
      xPercent: -50,
      yPercent: -50,
    })

    gsap.set([".mirror1 .cavity-mirror", ".mirror2 .cavity-mirror"], {
      drawSVG: "0%",
      fill: "#00000000",
    })

    gsap.to([".mirror1 .cavity-mirror", ".mirror2 .cavity-mirror"], {
      x: 2*mirrorInitialPosition,
      drawSVG: "100%",
      duration: 0.5,
    })

    gsap.to([".mirror1 .cavity-mirror", ".mirror2 .cavity-mirror"], {
      fill: (index) => { return index === 0 ? color_mirror1 : color_mirror2 },
      duration: 0.5,
    })

    timeline.addLabel("step-0")

    const modePaths = initializeCavityModes(nCavityModes, modeSVGWidth, modeSVGHeight, modeColors);

    timeline.to(modePaths, {
      drawSVG: "100%",
      duration: 0.5,
      ease: "power1.inOut",
      stagger: 0.4
    })

    timeline.call(() => {
      modePaths.forEach((path, i) => {
        gsap.to(path, {
          scaleY: -1,
          duration: 1 / (i + 1),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          svgOrigin: "0 0",
        })
      })
    })

    timeline.addLabel("step-1")
  })
})

onUnmounted(() => {
  setTimeout(() => {
    ctx.revert()
  }, 500)
})

function initializeCavityModes(nCavityModes, modeSVGWidth, modeSVGHeight, modeColors) {
  const xList = linrange(0, modeSVGWidth, 30);
  const kList = Array.from({ length: nCavityModes }, (_, i) => (i + 1) * Math.PI / modeSVGWidth);
  const fList = kList.map(k => x => modeSVGHeight * Math.sin(k * x) / 3);

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

function getCoordinates(f, xValues) {
  return xValues.map(x => ({ x: x, y: f(x) }));
}

function linrange(a, b, n) {
  const step = (b - a) / (n - 1);
  return Array.from({ length: n }, (_, i) => a + i * step);
}

</script>

<style scoped>
.mirror1,
.mirror2 {
  transform-origin: center;
}
</style>