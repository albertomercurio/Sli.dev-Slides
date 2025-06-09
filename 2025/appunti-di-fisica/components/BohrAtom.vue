<template>
    <svg :width="size" :height="size" :viewBox="viewBox">
        <!-- Orbits -->
        <ellipse v-for="(count, i) in orbits" class="orbit" :key="'orbit-' + i" :id="'orbit-' + i" :cx="center"
            :cy="center" :rx="radiusStep * (i + 1) * orbit_radius_ratio[i]" :ry="radiusStep * (i + 1)"
            :transform="`rotate(45 ${center} ${center})`" />

        <!-- Electrons -->
        <template v-for="(electronCount, orbitIndex) in orbits" :key="'electrons-' + orbitIndex">
            <circle v-for="electronIndex in electronCount" :key="'e-' + orbitIndex + '-' + electronIndex"
                :id="'electron-' + orbitIndex + '-' + electronIndex" class="electron" :cx="center" :cy="center" />
        </template>


        <!-- Nucleus: Alternating protons (red) and neutrons (gray) -->
        <circle v-for="(pos, i) in [...nucleusLayout].reverse()" :key="'nucleon-' + i" :cx="pos[0]" :cy="pos[1]"
            :class="i % 2 === 0 ? 'nucleon proton' : 'nucleon neutron'" />
    </svg>
</template>

<script setup>
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

let ctx;
onSlideEnter(() => {
    ctx = gsap.context(() => {
        props.orbits.forEach((electronCount, orbitIndex) => {
            const orbitPath = MotionPathPlugin.convertToPath(`#orbit-${orbitIndex}`)[0];
            for (let electronIndex = 0; electronIndex < electronCount; electronIndex++) {
                gsap.to(`#electron-${orbitIndex}-${electronIndex + 1}`, {
                    motionPath: {
                        path: orbitPath,
                        align: orbitPath,
                        alignOrigin: [0.5, 0.5],
                        start: electronIndex / electronCount,
                        end: (electronIndex / electronCount) + 1,
                    },
                    duration: props.speeds[orbitIndex] || 5, // Default to 5 if speed not provided
                    repeat: -1,
                    ease: "linear",
                });
            }
        });
    });
})

onSlideLeave(() => {
    // We delay the revert to avoid abrupt stops during slide transitions
    gsap.delayedCall(0.5, () => {
        ctx.revert()
    })
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
    r: 4;
}

.nucleon {
    r: v-bind(nucleonRadius);
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