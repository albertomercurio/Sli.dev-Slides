<template>
    <div ref="slideRef" class="slide">
        <SlideTitle>Gauge Invariance</SlideTitle>

        <Latex id="gauge-transformation-potentials" class="latex-formula absolute" expression="\begin{align*} A \to A + \nabla \chi \\ \phi \to \phi - \frac{\partial \chi}{\partial t} \end{align*}" :display="true" />

        <Latex id="gauge-transformation-fields" class="latex-formula absolute" expression="\begin{align*} \mathbf{E} \to \mathbf{E} + \nabla \times \mathbf{A} \\ \mathbf{B} \to \mathbf{B} - \nabla \chi \end{align*}" :display="true" />

        <div id="coulomb-gauge-label" class="absolute text-[#555] text-2xl">
            Coulomb Gauge
        </div>

        <div id="dipole-gauge-label" class="absolute text-[#555] text-2xl">
            Dipole Gauge
        </div>

        <Latex id="hamiltonian-coulomb" class="latex-formula total-hamiltonian absolute" expression="\hat{H}_\mathrm{C} =  \frac{\hat{p}^2}{2m} + V(\hat{x}) + \omega_c \hat{a}^\dagger \hat{a} - \frac{q}{m} A_0 \hat{p} (\hat{a} + \hat{a}^\dagger) + \frac{q^2 A_0^2}{2m} (\hat{a} + \hat{a}^\dagger)^2" :display="true" />
        <Latex id="hamiltonian-dipole-rotation" class="latex-formula total-hamiltonian absolute" expression="\begin{gather*} \hat{H}_\mathrm{D} = \hat{U}^\dagger \hat{H}_\mathrm{C} \hat{U} \\ \text{with} \\ \hat{U} = e^{i q A_0 \hat{x} (\hat{a} + \hat{a}^\dagger)} \end{gather*}" :display="true" />
        <Latex id="hamiltonian-dipole" class="latex-formula total-hamiltonian absolute" expression="\hat{H}_\mathrm{C} = \frac{\hat{p}^2}{2m} + V(\hat{x}) + \omega_c \hat{a}^\dagger \hat{a} - i q A_0 \hat{x} (\hat{a} - \hat{a}^\dagger) + q^2 A_0^2 \omega_c \hat{x}^2" :display="true" />

        <p id="reference" class="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-black text-xs italic underline">Cohen-Tannoudji, John Wiley & Sons, 1998</p>

        <h3 id="question" class="absolute w-full !text-slate-600">
            What happens if we project into the two-level subspace?
        </h3>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
gsap.registerPlugin(DrawSVGPlugin)
gsap.registerPlugin(MotionPathPlugin)

const slideRef = ref(null)
const ctx = gsap.context(() => { }, slideRef.value)

const maxSteps = ref(4); // Maximum steps for the slide
const props = defineProps({
  step: { type: Number, required: true }
})
defineExpose({
  maxSteps
});

onMounted(() => {
    ctx.add(() => {
        GSAPInitializeElements()

        const timeline = gsap.timeline({
            paused: true,
            defaults: {
                duration: 0.5,
                ease: "power2.inOut",
            },
        })

        watch(() => props.step, newStep => {
            const tweenOld = `step-${newStep-1}`
            const tweenNew = `step-${newStep}`
            // Use tweenTo for smooth forward *and* backward motion
            if (newStep > 0 && newStep <= maxSteps.value) {
                timeline.tweenFromTo(tweenOld, tweenNew);
            }
        });

        timeline.addLabel("step-0")

        timeline.to(["#gauge-transformation-potentials", "#gauge-transformation-fields"], {
            autoAlpha: 0,
        })

        timeline.to(["#coulomb-gauge-label", "#hamiltonian-coulomb"], {
            autoAlpha: 1,
        })

        timeline.addLabel("step-1")

        timeline.to(["#dipole-gauge-label", "#hamiltonian-dipole-rotation", "#reference"], {
            autoAlpha: 1,
        })

        timeline.addLabel("step-2")

        timeline.to("#hamiltonian-dipole-rotation", {
            autoAlpha: 0,
        })

        timeline.to("#hamiltonian-dipole", {
            autoAlpha: 1,
        }, "<")

        timeline.addLabel("step-3")

        timeline.to(["#coulomb-gauge-label", "#dipole-gauge-label", "#reference"], {
            autoAlpha: 0,
        })

        timeline.to("#question", {
            autoAlpha: 1,
        })

        timeline.addLabel("step-4")

    }, slideRef.value)
})

onUnmounted(() => {
    setTimeout(() => {
        ctx.revert()
    }, 500)
})

function GSAPInitializeElements() {
    gsap.set("#gauge-transformation-potentials", {
        top: "30%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        scale: 1.2,
    })

    gsap.set("#gauge-transformation-fields", {
        bottom: "30%",
        left: "50%",
        xPercent: -50,
        yPercent: 50,  // Changed from -50 to 50 for bottom positioning
        scale: 1.2,
    })

    gsap.set("#coulomb-gauge-label", {
        top: "20%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
    })
    gsap.set("#dipole-gauge-label", {
        bottom: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: 50,  // Changed from -50 to 50 for bottom positioning
    })
    gsap.set("#hamiltonian-coulomb", {
        top: "30%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        scale: 1.2,
    })
    gsap.set("#hamiltonian-dipole-rotation", {
        bottom: "30%",
        left: "50%",
        xPercent: -50,
        yPercent: 50,  // Changed from -50 to 50 for bottom positioning
        scale: 1.2,
    })
    gsap.set("#hamiltonian-dipole", {
        bottom: "35%",
        left: "50%",
        xPercent: -50,
        yPercent: 50,
        scale: 1.2,
    })
    gsap.set("#question", {
        top: "45%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
    })

    gsap.set(["#coulomb-gauge-label", "#dipole-gauge-label", "#hamiltonian-coulomb", "#hamiltonian-dipole-rotation", "#hamiltonian-dipole", "#reference", "#question"], {
        autoAlpha: 0,
    })
}

</script>