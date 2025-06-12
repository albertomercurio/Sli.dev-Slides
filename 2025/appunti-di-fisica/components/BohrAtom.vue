<template>
    <svg ref="rootRef" :width="size" :height="size" :viewBox="viewBox">
        <!-- Nucleus: Alternating protons (red) and neutrons (gray) -->
        <circle v-for="(pos, i) in [...nucleusLayout].reverse()" :key="'nucleon-' + i" :cx="pos[0]" :cy="pos[1]"
            :r="nucleonRadius" :class="i % 2 === 0 ? 'nucleon proton' : 'nucleon neutron'" />

        <!-- Orbits -->
        <ellipse v-for="(count, i) in orbits" class="orbit" 
            :key="'orbit-' + i"
            :cx="center"
            :cy="center"
            :rx="radiusStep * (i + 1) * orbitRadiusRatio[i]" :ry="radiusStep * (i + 1)" />

        <!-- Electrons: Grouped by orbit -->
        <template v-for="(electronCount, orbitIndex) in orbits" :key="'electron-group-' + orbitIndex">
            <circle v-for="n in electronCount"
                :key="'e-' + orbitIndex + '-' + n"
                :class="`electron-group-${orbitIndex} electron`" :cx="center" :cy="center" r="4" />
        </template>
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
    orbitRadiusRatio: { type: Array, default: () => [1, 1.5] },
    totalNucleons: { type: Number, default: 7 }, // Total protons + neutrons
    size: { type: Number, default: 200 },
    enableAnimation: { type: Boolean, default: true },
})

const center = props.size / 2
const radiusStep = props.size / 8
const viewBox = `0 0 ${props.size} ${props.size}`
const nucleonRadius = 4
const nucleusLayout = generatePackedNucleusAlternating(props.totalNucleons)

const rootRef = ref(null);
const orbitsList = ref([]);
const electronsList = ref(props.orbits.map(() => []));
const ctx = gsap.context(() => {});

defineExpose({
    rootRef,
    orbitsList,
    electronsList,
    startAnimation,
})

onSlideEnter(() => {
    // Ensure the DOM is updated before accessing rootRef
    // Usually this only happens if this component is mounted in the first rendered slide
    if (!rootRef.value) {
        console.warn("Component not yet mounted!");
        return;
    }
    populateOrbitsList(rootRef.value);
    populateElectronsList(rootRef.value, orbitsList.value);
    if (!props.enableAnimation) return;
    startAnimationContext(orbitsList.value, electronsList.value);
})

onSlideLeave(() => {
    stopAnimation();
})

function startAnimationContext(orbitsList, electronsList) {
    ctx.add(() => {
        startAnimation(orbitsList, electronsList);
    }, rootRef.value);
}

function startAnimation(orbitsList, electronsList) {
    gsap.set(orbitsList, {
            rotation: 50,
            transformOrigin: "50% 50%",
    });
    orbitsList.forEach((orbitElement, orbitIndex) => {
        const [orbitPath] = MotionPathPlugin.convertToPath(orbitElement);
        const electrons = electronsList[orbitIndex];

        electrons.forEach((electron, electronIndex) => {
            gsap.to(electron, {
                motionPath: {
                    path: orbitPath,
                    align: orbitPath,
                    alignOrigin: [0.5, 0.5],
                    start: electronIndex / electrons.length,
                    end: (electronIndex / electrons.length) + 1,
                },
                duration: props.speeds[orbitIndex],
                repeat: -1,
                ease: "linear",
            });
        });
    });
}

function stopAnimation() {
    ctx.revert();
}

// Populate the orbits and electrons lists based on the SVG structure at runtime
// This avoids possible conflicts
function populateOrbitsList(rootRef) {
    orbitsList.value = Array.from(rootRef.querySelectorAll('.orbit'));
}

function populateElectronsList(rootRef, orbitsList) {
    orbitsList.forEach((_, orbitIndex) => {
        const electrons = rootRef.querySelectorAll(`.electron-group-${orbitIndex}`);
        electronsList.value[orbitIndex] = Array.from(electrons);
    });
}

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