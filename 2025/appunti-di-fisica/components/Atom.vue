<template>
  <div class="atom center-flex" :style="{ width: size + 'px', height: size + 'px' }">
    <!-- Nucleus -->
    <div class="nucleus center-flex">
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
      class="orbit center-flex"
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

interface Props {
  protons?: number
  neutrons?: number
  electrons?: number[] // electrons per shell
  orbitRadii?: number[] // px
  orbitSpeeds?: number[] // sec per revolution
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
    transform: `rotate(${angle}rad) translate(${radius}px)`,
  }
}
</script>

<style scoped>
.center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

.atom {
  position: relative;
}

/* ---------- Nucleus ---------- */
.nucleus {
  position: absolute;
}

.nucleon {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #777;
}

.nucleon.proton {
  background: #e74c3c;
}

/* ---------- Orbits ---------- */
.orbit {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  animation: orbit-rotate linear infinite;
}

@keyframes orbit-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ---------- Electrons ---------- */
.electron {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3fa7f4;
  /* Each electron's inline style provides its translate & rotation */
}
</style>
