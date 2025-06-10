<template>
    <svg ref="rootRef" :width="size" :height="size" :viewBox="viewBox">
        <!-- Orbits -->
        <ellipse v-for="(count, i) in orbits" class="orbit" 
            :ref="el => orbitsList[i] = el"
            :key="'orbit-' + i"
            :cx="center"
            :cy="center"
            :rx="radiusStep * (i + 1) * orbit_radius_ratio[i]" :ry="radiusStep * (i + 1)"
            :transform="`rotate(45 ${center} ${center})`" />

        <!-- Electrons: Grouped by orbit -->
        <template v-for="(electronCount, orbitIndex) in orbits" :key="'electron-group-' + orbitIndex">
            <circle v-for="n in electronCount"
                :ref="el => electronsList[orbitIndex][n - 1] = el"
                :key="'e-' + orbitIndex + '-' + n"
                :class="`electron-group-${orbitIndex} electron`" :cx="center" :cy="center" r="4" />
        </template>

        <!-- Nucleus: Alternating protons (red) and neutrons (gray) -->
        <circle v-for="(pos, i) in [...nucleusLayout].reverse()" :key="'nucleon-' + i" :cx="pos[0]" :cy="pos[1]"
            :r="nucleonRadius" :class="i % 2 === 0 ? 'nucleon proton' : 'nucleon neutron'" />
    </svg>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { onSlideEnter, onSlideLeave } from '@slidev/client'

gsap.registerPlugin(MotionPathPlugin)

const props = defineProps({
    orbits: { type: Array, default: () => [2, 3] },
    speeds: { type: Array, default: () => [4, 2] },
    orbit_radius_ratio: { type: Array, default: () => [1, 1.5] },
    totalNucleons: { type: Number, default: 7 }, // Total protons + neutrons
    size: { type: Number, default: 200 },
})

const center = props.size / 2
const radiusStep = props.size / 8
const viewBox = `0 0 ${props.size} ${props.size}`
const nucleonRadius = 4
const nucleusLayout = generatePackedNucleusAlternating(props.totalNucleons)

const rootRef = ref(null);
const orbitsList = ref([]);
const electronsList = ref(props.orbits.map(() => []));
const ctx = ref(null);

defineExpose({
    orbitsList,
    electronsList,
})

onSlideEnter(() => {
    // Ensure the DOM is updated before accessing rootRef
    // Usually this only happens if this component is mounted in the first rendered slide
    if (!rootRef.value) {
        console.error("Component not yet mounted!");
        return;
    }
    ctx.value = gsap.context(() => {
        electronsList.value.forEach((electrons, orbitIndex) => {
            const orbitElement = orbitsList.value[orbitIndex];
            const orbitPath = MotionPathPlugin.convertToPath(orbitElement)[0];

            gsap.to(electrons, {
                motionPath: (i, target) => ({
                    path: orbitPath,
                    align: orbitPath,
                    alignOrigin: [0.5, 0.5],
                    start: i / electrons.length,
                    end: (i / electrons.length) + 1,
                }),
                duration: props.speeds[orbitIndex] || 5,
                repeat: -1,
                ease: "linear",
            });
        });
    }); // Scope the context to the component's root element
})

onSlideLeave(() => {
    ctx.value?.revert()
})

function generatePackedNucleusAlternating(total) {
    let overlapFactor = 1.6
    let spacing = nucleonRadius * overlapFactor
    const positions = [[center, center]]
    if (total === 1) return positions

    let count = 1
    let ring = 1

    while (count < total) {
        const radius = ring * spacing
        const steps = 6 * ring
        for (let i = 0; i < steps && count < total; i++) {
            const angle = (2 * Math.PI * i) / steps
            const x = center + radius * Math.cos(angle)
            const y = center + radius * Math.sin(angle)
            positions.push([x, y])
            count++
        }
        ring++
    }

    return positions
}

</script>

<style scoped>
.orbit {
    fill: none;
    stroke: #888;
    stroke-dasharray: 4 4;
}

.electron {
    fill: #1e90ff;
}

.nucleon {
    stroke: black;
    stroke-width: 0.5;
}

.proton {
    fill: #dc3e2c;
}

.neutron {
    fill: #555;
}
</style>