<template>
  <div ref="slideRef" class="slide">
      <BohrAtom ref="atomRef" />
      <div ref="photonRef" class="absolute w-3 h-3 rounded-full bg-yellow-400 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import BohrAtom from "../src/components/BohrAtom.vue";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(MotionPathPlugin);

const slideRef = ref();
const atomRef = ref();
const photonRef = ref(null);
const ctx = gsap.context(() => {});

onMounted(() => {
  ctx.add(() => {
    const atom = atomRef.value.rootRef;
    const photon = photonRef.value;
    const electron = gsap.utils.toArray(".electron")[0];
    const orbit1 = gsap.utils.toArray(".orbit-1")[0];

    // Set initial position of the photon
    gsap.set(photon, {
      x: -200,
      y: gsap.getProperty(electron, 'y'),
      opacity: 0
    });

    const timeline = gsap.timeline();

    timeline.to(atom, {
        x: 200,
        duration: 2,
        ease: "power1.inOut"
    });

    timeline.to(photon, {
      opacity: 1,
      duration: 1,
    }, '>');

    timeline.to(photon, {
      scale: 1.5,
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
    }, '<+2');

    timeline.to(photon, {
      opacity: 0,
      duration: 1,
    });

    timeline.call(() => {
        let electronTween = gsap.getTweensOf(".electron")[0];
        electronTween.pause();
    });

    timeline.to(electron, {
      scale: 1.5,
      fill: '#822433',
      duration: 0.5,
      yoyo: true,
      repeat: 1,
    });

    timeline.to(electron, {
        attr: {
            cx: () => "+=" + atomRef.value.getOrbitRelativeDistance(".electron", ".orbit-1", 0.1).x,
            cy: () => "+=" + atomRef.value.getOrbitRelativeDistance(".electron", ".orbit-1", 0.1).y
        },
        duration: 2,
        ease: "power1.inOut"
    });

    timeline.to(electron, {
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
    }, slideRef.value);
});

onUnmounted(() => {
  ctx.revert();
});
</script>