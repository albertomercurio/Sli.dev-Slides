<template>
  <div ref="slideRef" class="slide">
    <SlideTitle tag="h2">
      Fabry-Perot Cavity
    </SlideTitle>
    <div class="absolute" id="cavity-group">
      <CavityMirror ref="mirror1Ref" class="mirror1 absolute" :size="80" />
      <CavityMirror ref="mirror2Ref" class="mirror2 absolute" :size="80" />
      <EmptySVG v-for="i in nCavityModes" ref="cavityModeRefs" :key="`mode-${i}`"
      :width="modeSVGWidth" :height="modeSVGHeight"
        class="cavity-mode absolute" />
    </div>

    <Latex id="cavity-hamiltonian" :display="true" class="absolute" expression="\hat{H} = \hbar \sum_n \omega_n \hat{a}_n^\dagger \hat{a}_n" />
    <Latex id="cavity-frequencies" :display="true" class="absolute" expression="\omega_n = \frac{c}{L} n \quad \rightarrow \quad  \Delta \omega_n = \omega_{n+1} - \omega_n = \frac{c}{L}" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { gsap } from 'gsap'
import { linrange, getCoordinates, drawSVG } from '../src/utils/utils.js'
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

const maxSteps = ref(3); // Maximum steps for the slide
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

    const timeline = gsap.timeline({
      paused: false, 
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

    GSAPInitializeElements();
    const modePaths = initializeCavityModes(nCavityModes, modeSVGWidth, modeSVGHeight, modeColors);

    drawSVG(
      timeline,
      [".mirror1 .cavity-mirror", ".mirror2 .cavity-mirror"],
      (index) => { return index === 0 ? color_mirror1 : color_mirror2 },
      "100%",
      0.1,
      {
        x: 2*mirrorInitialPosition,
        duration: 1
      }
    )

    timeline.addPause()

    timeline.addLabel("step-0")

    timeline.to(modePaths, {
      drawSVG: "100%",
      stagger: 0.4
    })

    timeline.call(() => {
      modePaths.forEach((path, i) => {
        gsap.to(path, {
          scaleY: -1,
          duration: 2 / (i + 1),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          svgOrigin: "0 0",
        })
      })
    })

    timeline.addLabel("step-1")

    timeline.to("#cavity-group", {
      y: -50,
    })

    timeline.to("#cavity-hamiltonian", {
      autoAlpha: 1,
    }, "<")

    timeline.addLabel("step-2")

    timeline.to("#cavity-hamiltonian", {
      y: "-=" + 60,
    })

    timeline.to("#cavity-frequencies", {
      autoAlpha: 1,
    }, "<")

    timeline.addLabel("step-3")
  }, slideRef.value)
})

onUnmounted(() => {
  setTimeout(() => {
    ctx.revert()
  }, 500)
})

function GSAPInitializeElements() {
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

  gsap.set(["#cavity-hamiltonian", "#cavity-frequencies"], {
    y: 170,
    left: "50%",
    top: "50%",
    xPercent: -50,
    yPercent: -50,
    autoAlpha: 0,
  })
}

function initializeCavityModes(nCavityModes, modeSVGWidth, modeSVGHeight, modeColors) {
  const xList = linrange(0, modeSVGWidth, 30);
  const kList = Array.from({ length: nCavityModes }, (_, i) => (i + 1) * Math.PI / modeSVGWidth);
  const fList = kList.map(k => x => modeSVGHeight * Math.sin(k * x) / 3);

  const modePaths = cavityModeRefs.value.map((ref) => ref.pathRef[0]);

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
