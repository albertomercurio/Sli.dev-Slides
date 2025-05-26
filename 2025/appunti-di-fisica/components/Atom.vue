<template>
  <div class="atom" :style="{ width: size + 'px', height: size + 'px' }">
    <!-- Nucleus -->
    <div class="nucleus" :style="nucleusStyle">
      <div
        v-for="n in totalNucleons"
        :key="`n-${n}`"
        class="nucleon"
        :class="{ proton: n <= protons, neutron: n > protons }"
        :style="getNucleonStyle(n)"
      />
    </div>

    <!-- Orbits & electrons -->
    <div
      v-for="(count, shellIdx) in electronCounts"
      :key="`orbit-${shellIdx}`"
      class="orbit"
      :style="getOrbitStyle(shellIdx)"
    >
      <div
        v-for="eIdx in count"
        :key="`e-${shellIdx}-${eIdx}`"
        class="electron"
        :style="getElectronStyle(shellIdx, eIdx)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type NumArray = number[]

interface Props {
  protons?: number
  neutrons?: number
  electrons?: NumArray // electrons per shell
  orbitRadii?: NumArray // px
  orbitSpeeds?: NumArray // sec per revolution
  size?: number // px – outer box
}

const props = withDefaults(defineProps<Props>(), {
  protons: 2,
  neutrons: 2,
  electrons: () => [2, 1],
  orbitRadii: () => [],
  orbitSpeeds: () => [],
  size: 150,
})

const totalNucleons = computed(() => props.protons + props.neutrons)
const electronCounts = computed(() => props.electrons)

// scale nucleus roughly to 16 % of the overall box but never below 16 px
const nucleusDiameter = computed(() => Math.max(16, props.size * 0.16))

function nucleusStyle() {
  const d = nucleusDiameter.value
  return {
    width: `${d}px`,
    height: `${d}px`,
  }
}

function getNucleonStyle(idx: number) {
  // Arrange nucleons in a tiny circle inside the nucleus
  const angle = (idx / totalNucleons.value) * Math.PI * 2
  const r = nucleusDiameter.value / 5
  return {
    transform: `translate(${Math.cos(angle) * r}px, ${Math.sin(angle) * r}px)`,
  }
}

function getOrbitStyle(shellIdx: number) {
  const radius = props.orbitRadii[shellIdx] ?? 30 + shellIdx * 25
  const diameter = radius * 2
  const speed = props.orbitSpeeds[shellIdx] ?? 6 + shellIdx * 4
  return {
    width: `${diameter}px`,
    height: `${diameter}px`,
    animationDuration: `${speed}s`,
  }
}

function getElectronStyle(shellIdx: number, eIdx: number) {
  const radius = props.orbitRadii[shellIdx] ?? 30 + shellIdx * 25
  const count = electronCounts.value[shellIdx]
  const angle = (eIdx / count) * Math.PI * 2
  return {
    transform: `translate(-50%, -50%) rotate(${angle}rad) translate(${radius}px)`,
  }
}
</script>

<style scoped>
.atom {
  position: relative;
  /* let parent slides decide flex / margin */
}

/* ---------- Nucleus ---------- */
.nucleus {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nucleon {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--neutron, #777);
}

.nucleon.proton {
  background: var(--proton, #e74c3c);
}

/* ---------- Orbits ---------- */
.orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px dashed rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
  animation: orbit-rotate linear infinite;
}

@keyframes orbit-rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* ---------- Electrons ---------- */
.electron {
  position: absolute;
  top: 50%; /* start at north pole of orbit */
  left: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--electron, #3fa7f4);
  /* Each electron's inline style provides its translate & rotation */
}
</style>
