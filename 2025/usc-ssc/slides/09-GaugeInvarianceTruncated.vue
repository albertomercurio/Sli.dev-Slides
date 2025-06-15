<template>
    <div ref="slideRef" class="slide">
        <SlideTitle>Gauge Invariance and Truncated Models</SlideTitle>

        <!-- Coulomb Gauge Hamiltonian -->
        <Latex id="projection-operator" expression="\hat{P} = \vert 0 \rangle \langle 0 \vert + \vert 1 \rangle \langle 1 \vert" class="latex-formula absolute" :display="true" />

        <Latex id="coulomb-hamiltonian-projected-1" expression="\hat{\mathcal{H}}_\mathrm{C} = \hat{P} \hat{H}_\mathrm{C} \hat{P}" class="latex-formula absolute" :display="true" />

        <Latex id="coulomb-hamiltonian-projected-2" expression="\hat{\mathcal{H}}_\mathrm{C} = \frac{\omega_{10}}{2} \hat{\sigma}_z + \omega_c \hat{a}^\dagger \hat{a} + g_\mathrm{C} \hat{\sigma}_y (\hat{a} + \hat{a}^\dagger) + D (\hat{a} + \hat{a}^\dagger)^2" class="latex-formula absolute" :display="true" />

        <!-- Dipole Gauge Hamiltonian -->
        <Latex id="dipole-hamiltonian-projected-1" expression="\hat{\mathcal{H}}_\mathrm{D} = \hat{P} \hat{H}_\mathrm{D} \hat{P}" class="latex-formula absolute" :display="true" />
        <Latex id="dipole-hamiltonian-projected-2" expression="= \hat{P} \hat{U}^\dagger \hat{H}_\mathrm{C} \hat{U} \hat{P}" class="latex-formula absolute" :display="true" />
        <Latex id="dipole-hamiltonian-projected-3" expression="\hat{\mathcal{H}}_\mathrm{D} = \frac{\bar{\omega}_{10}}{2} \hat{\sigma}_z + \omega_c \hat{a}^\dagger \hat{a} - i g_\mathrm{D} \hat{\sigma}_x (\hat{a} - \hat{a}^\dagger)" class="latex-formula absolute" :display="true" />

        <h3 id="question" class="absolute w-full !text-slate-600">
            Are the two low-energy modes equivalent?
        </h3>

        <img id="de-bernardis-gauge" class="absolute" src="/images/plots/de-bernardis-gauge.svg">
        <p id="de-bernardis-reference" class="absolute text-black text-xs italic underline">De Bernardis, et al., Phys. Rev. A 98.5 (2018)</p>

        <img id="di-stefano-gauge" class="absolute" src="/images/plots/di-stefano-gauge.png">
        <p id="di-stefano-reference" class="absolute text-black text-xs italic underline">Di Stefano, et al.,  Nat. Phys. 15, 803–808 (2019)</p>

        <h3 id="question-dipole-gauge" class="absolute w-full !text-slate-600">
            Is the dipole gauge always good?
        </h3>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { getDistance, setAlignElementTo } from '../src/utils/utils.js'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
gsap.registerPlugin(DrawSVGPlugin)
gsap.registerPlugin(MotionPathPlugin)

const slideRef = ref(null)
const ctx = gsap.context(() => { }, slideRef.value)

const maxSteps = ref(11); // Maximum steps for the slide
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

        let dist = getDistance("#coulomb-hamiltonian-projected-1", "#projection-operator")
        timeline.to(["#projection-operator", "#coulomb-hamiltonian-projected-1", "#coulomb-hamiltonian-projected-2"], {
            x: "+=" + dist.x,
            y: "+=" + dist.y,
        })

        timeline.to("#coulomb-hamiltonian-projected-1", {
            autoAlpha: 1,
        }, "<")

        timeline.addLabel("step-1")

        timeline.to(["#projection-operator", "#coulomb-hamiltonian-projected-1", "#coulomb-hamiltonian-projected-2"], {
            x: "+=" + dist.x,
            y: "+=" + dist.y,
        })
        timeline.to("#coulomb-hamiltonian-projected-2", {
            autoAlpha: 1,
        }, "<")

        timeline.addLabel("step-2")

        timeline.to(["#projection-operator", "#coulomb-hamiltonian-projected-1"], {
            autoAlpha: 0,
        })

        timeline.to("#coulomb-hamiltonian-projected-2", {
            bottom: 100,
            yPercent: 50,
        }, "<")

        timeline.addLabel("step-3")

        timeline.to("#dipole-hamiltonian-projected-1", {
            autoAlpha: 1,
        })

        timeline.addLabel("step-4")

        timeline.to(["#dipole-hamiltonian-projected-1", "#dipole-hamiltonian-projected-2", "#dipole-hamiltonian-projected-3"], {
            x: "+=" + dist.x,
            y: "+=" + dist.y,
        })
        timeline.to("#dipole-hamiltonian-projected-2", {
            autoAlpha: 1,
        }, "<")

        timeline.addLabel("step-5")

        timeline.to(["#dipole-hamiltonian-projected-1", "#dipole-hamiltonian-projected-2", "#dipole-hamiltonian-projected-3"], {
            x: "+=" + dist.x,
            y: "+=" + dist.y,
        })
        timeline.to("#dipole-hamiltonian-projected-3", {
            autoAlpha: 1,
        }, "<")

        timeline.addLabel("step-6")

        timeline.to(["#dipole-hamiltonian-projected-1", "#dipole-hamiltonian-projected-2"], {
            autoAlpha: 0,
        })
        timeline.to("#dipole-hamiltonian-projected-3", {
            top: 100,
        }, "<")

        timeline.addLabel("step-7")

        timeline.to("#question", {
            autoAlpha: 1,
        })

        timeline.addLabel("step-8")

        timeline.to(["#coulomb-hamiltonian-projected-2", "#dipole-hamiltonian-projected-3", "#question"], {
            autoAlpha: 0,
        })

        timeline.fromTo(["#de-bernardis-gauge", "#de-bernardis-reference"], {
            autoAlpha: 0,
            scale: 0,
        }, {
            autoAlpha: 1,
            scale: 1,
        })

        timeline.addLabel("step-9")

        timeline.to(["#de-bernardis-gauge", "#de-bernardis-reference", "#di-stefano-gauge", "#di-stefano-reference"], {
            x: "+= 1200",
        })

        timeline.addLabel("step-10")

        timeline.to(["#di-stefano-gauge", "#di-stefano-reference"], {
            autoAlpha: 0,
            scale: 0,
        })
        timeline.to("#question-dipole-gauge", {
            autoAlpha: 1,
        })

    }, slideRef.value)
})

onUnmounted(() => {
    setTimeout(() => {
        ctx.revert()
    }, 500)
})

function GSAPInitializeElements() {
    gsap.set(".latex-formula", {
        scale: 1.2,
    })

    gsap.set(["#projection-operator", "#de-bernardis-gauge", "#di-stefano-gauge"], {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
    })

    gsap.set(["#question", "#question-dipole-gauge"], {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -100,
    })

    gsap.set("#di-stefano-gauge", {
        scale: 0.3,
    })

    setAlignElementTo(gsap, "#coulomb-hamiltonian-projected-1", "#projection-operator", [0.5, 0.0], [0.5, 1.0]);

    setAlignElementTo(gsap, "#coulomb-hamiltonian-projected-2", "#coulomb-hamiltonian-projected-1", [0.5, 0.0], [0.5, 1.0]);

    setAlignElementTo(gsap, "#dipole-hamiltonian-projected-1", "#projection-operator");

    setAlignElementTo(gsap, "#dipole-hamiltonian-projected-2", "#dipole-hamiltonian-projected-1", [0.5, 0.0], [0.5, 1.0]);

    setAlignElementTo(gsap, "#dipole-hamiltonian-projected-3", "#dipole-hamiltonian-projected-2", [0.5, 0.0], [0.5, 1.0]);

    setAlignElementTo(gsap, "#de-bernardis-reference", "#de-bernardis-gauge", [0.5, 0.0], [0.5, 1.02]);

    setAlignElementTo(gsap, "#di-stefano-reference", "#di-stefano-gauge", [0.5, 0.0], [0.5, 1.02]);

    gsap.set(["#coulomb-hamiltonian-projected-1", "#coulomb-hamiltonian-projected-2", "#dipole-hamiltonian-projected-1", "#dipole-hamiltonian-projected-2", "#dipole-hamiltonian-projected-3", "#question", "#de-bernardis-gauge", "#de-bernardis-reference", "#question-dipole-gauge"], {
        autoAlpha: 0,
    })

    gsap.set(["#di-stefano-gauge", "#di-stefano-reference"], {
        x: "-= 1200"
    })
}


</script>