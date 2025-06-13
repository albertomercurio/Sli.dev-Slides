<template>
  <div ref="slideRef" class="slide">
      <BohrAtom ref="atomRef" />
      <div ref="photonRef" class="photon absolute w-3 h-3 rounded-full bg-yellow-400 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import BohrAtom from "../src/components/BohrAtom.vue";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(MotionPathPlugin);

const slideRef = ref();
const atomRef = ref();
const photonRef = ref(null);
const ctx = gsap.context(() => {});
const maxSteps = ref(4); // Maximum steps for the slide

const props = defineProps({
  step: { type: Number, required: true }
})

defineExpose({
  maxSteps
});

onMounted(() => {
  ctx.add(() => {
    const atom = atomRef.value.rootRef;
    const photon = photonRef.value;
    const electron = gsap.utils.toArray(".electron")[0];
    const orbit0 = gsap.utils.toArray(".orbit-0")[0];
    const orbit1 = gsap.utils.toArray(".orbit-1")[0];

    const timeline = gsap.timeline({paused: true});

    watch(() => props.step, newStep => {
      const tweenOld = `step-${newStep-1}`
      const tweenNew = `step-${newStep}`
      // Use tweenTo for smooth forward *and* backward motion
      if (newStep > 0) {
        timeline.tweenFromTo(tweenOld, tweenNew);
      }
    });

    // Set initial position of the photon
    gsap.set(photon, {
      x: -200,
      y: gsap.getProperty(electron, 'y'),
      opacity: 0
    });

    timeline.addLabel("step-0")

    timeline.to(atom, {
        x: 200,
        duration: 2,
        ease: "power1.inOut"
    });

    timeline.addLabel("step-1")

    timeline.to(photon, {
      opacity: 1,
      duration: 1,
    }, '>');

    timeline.to(photon, {
      scale: 2,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    }, '<');

    timeline.to(photon, {
      x: () => gsap.getProperty(atom, 'x'),
      y: () => gsap.getProperty(atom, 'y'),
      duration: 1,
      ease: 'power1.inOut',
    }, '<+3');

    timeline.to(photon, {
      opacity: 0,
      duration: 1,
    });

    timeline.addLabel("step-2")

    timeline.to(electron, {
      onStart: () => {
        let electronTween = gsap.getTweensOf(".electron-0-0")[0];
        electronTween.kill();
      },
      scale: 2,
      fill: '#822433',
      duration: 0.5,
      yoyo: true,
      repeat: 1,
    });

    timeline.to(electron, {
        attr: {
            cx: () => "+=" + atomRef.value.getOrbitRelativeDistance(".electron-0-0", ".orbit-1", 0.1).x,
            cy: () => "+=" + atomRef.value.getOrbitRelativeDistance(".electron-0-0", ".orbit-1", 0.1).y
        },
        duration: 2,
        ease: "power1.inOut"
    });

    // Workaround to handle infinite loop in a timeline
    timeline.to(".photon", {
      x: "+=" + 0,
      duration: 0.05,
    });
    timeline.call(() => {
      gsap.to(electron, {
        motionPath: {
          path: orbit1,
          align: orbit1,
          alignOrigin: [0.5, 0.5],
          start: 0.1,
          end: 1.1,
        },
        duration: 2,
        repeat: -1,
        ease: "linear",
      });
    });

    timeline.addLabel("step-3")

    timeline.to(electron, {
      onStart: () => {
        let electronTween = gsap.getTweensOf(".electron-0-0")[0];
        electronTween.kill();
      },
      scale: 2,
      fill: '#822433',
      duration: 0.5,
      yoyo: true,
      repeat: 1,
    });

    timeline.to(electron, {
        onStart: () => {
            let electronTweens = gsap.getTweensOf(".electron-0-0");
            let electronTween = electronTweens[electronTweens.length - 1];
            electronTween.kill();
        },
        attr: {
            cx: () => "+=" + atomRef.value.getOrbitRelativeDistance(".electron-0-0", ".orbit-0", 0.1).x,
            cy: () => "+=" + atomRef.value.getOrbitRelativeDistance(".electron-0-0", ".orbit-0", 0.1).y
        },
        duration: 2,
        ease: "power1.inOut",
    });

    // Workaround to handle infinite loop in a timeline
    timeline.to(".photon", {
      x: "+=" + 0,
      duration: 0.05,
    });
    timeline.call(() => {
      gsap.to(electron, {
        motionPath: {
          path: orbit0,
          align: orbit0,
          alignOrigin: [0.5, 0.5],
          start: 0.1,
          end: 1.1,
        },
        duration: 4,
        repeat: -1,
        ease: "linear",
      });
    });

    timeline.addLabel("step-4");

    }, slideRef.value);
});

onUnmounted(() => {
  setTimeout(() => {
    ctx.revert()
  }, 500) // delay in milliseconds
});
</script>