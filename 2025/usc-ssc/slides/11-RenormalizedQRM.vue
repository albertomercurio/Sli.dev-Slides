<template>
    <div class="slide" ref="slideRef">
        <SlideTitle>The Renormalized Quantum Rabi Model</SlideTitle>

        <Latex id="dipole-hamiltonian-total" class="absolute latex-formula" expression="\hat{H}_\mathrm{D} = \hat{H}_{0^\prime} + \hat{H}_\mathrm{int, D}^\mathrm{L} + \hat{H}_\mathrm{int, D}^\mathrm{H}" :display="true" />

        <Latex id="dipole-hamiltonian-std" class="absolute latex-formula" expression="\hat{H}_\mathrm{D} = \frac{\omega_{10}}{2} \hat{\sigma}_z + \omega_c \hat{a}^\dagger \hat{a} - i g \hat{\sigma}_x (\hat{a} - \hat{a}^\dagger)" :display="true" />

        <Latex id="dipole-hamiltonian-renorm" class="absolute latex-formula" 
               :expression="`\\begin{align*}
                           \\hat{H}_\\mathrm{D}^\\mathrm{eff} &= \\omega_c \\hat{a}^\\dagger \\hat{a} + \\left( \\frac{\\omega_{10}}{2} + \\frac{G_{11} - G_{00}}{2 \\omega_c} + A_- \\right) \\hat{\\sigma}_z \\\\
                           & \\ + \\left( B_+ + B_- \\hat{\\sigma}_z \\right) (\\hat{a} - \\hat{a}^\\dagger)^2 \\\\
                           & \\ - i (g_{01} + C_{01}) \\hat{\\sigma}_x (\\hat{a} - \\hat{a}^\\dagger) - D_{01} \\hat{\\sigma}_y (\\hat{a} + \\hat{a}^\\dagger)
                           \\end{align*}`" 
               :display="true" />

        <img id="renormalized-qrm-main" class="absolute" src="/images/plots/renormalized-qrm-main.svg">
        <p id="renormalized-qrm-reference" class="absolute text-black text-xs italic underline">Lamberto, et al., arXiv:2503.01651 (2025)</p>

        <img id="renormalized-qrm-anharm" class="absolute" src="/images/plots/renormalized-qrm-vs-anharm.svg">
        <Latex id="mean-squared-deviation" class="absolute latex-formula" expression="\sigma = \sqrt{\sum_{j=1}^N \left( E_j - E_j^\mathrm{full} \right)^2 / N}" :display="true" />

        <img id="fluxonium-circuit" class="absolute" src="/images/plots/fluxonium-circuit.svg">

        <Latex id="fluxonium-hamiltonian" class="absolute latex-formula" 
               expression="\hat{H}_\mathrm{F} = \frac{\hat{Q}_1^2}{2 C_1} + \frac{\hat{\phi}_1^2}{2 L_1} - E_J \cos{\left( \frac{\hat{\phi}_1}{\phi_0} - \frac{\phi_{\rm ext}}{\phi_0} \right)} + \frac{\hat{Q}_2^2}{2 C_2} + \frac{(\hat{\phi}_2 - \hat{\phi}_1)^2}{2 L_2}" 
               :display="true" />

        <img id="fluxonium-potential" class="absolute" src="/images/plots/fluxonium-potential.svg">

        <img id="fluxonium-eigenvalues" class="absolute" src="/images/plots/fluxonium-eigenvalues.svg">

        <img id="fluxonium-pi-pulse" class="absolute" src="/images/plots/fluxonium-pi-pulse.png">
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { linrange, getDistance, setAlignElementTo, preloadImages } from '../src/utils/utils.js'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
gsap.registerPlugin(DrawSVGPlugin)
gsap.registerPlugin(MotionPathPlugin)

const slideRef = ref(null)
const ctx = gsap.context(() => { }, slideRef.value)

const maxSteps = ref(9); // Maximum steps for the slide
const props = defineProps({
  step: { type: Number, required: true }
})
defineExpose({
  maxSteps
});

onMounted(async () => {
    await preloadImages([
        "/images/plots/renormalized-qrm-main.svg",
        "/images/plots/renormalized-qrm-vs-anharm.svg",
        "/images/plots/fluxonium-circuit.svg",
        "/images/plots/fluxonium-potential.svg",
        "/images/plots/fluxonium-eigenvalues.svg",
        "/images/plots/fluxonium-pi-pulse.png"
    ])
    ctx.add(() => {
        GSAPInitializeElements()

        const timeline = gsap.timeline({
            paused: true,
            defaults: {
                duration: 0.5,
                ease: "power2.inOut"
            }
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
            
        timeline.to("#dipole-hamiltonian-total", {
            autoAlpha: 0,
            scale: 0,
        })

        timeline.to("#dipole-hamiltonian-std", {
            autoAlpha: 1,
            scale: 1,
        })

        timeline.addLabel("step-1")

        timeline.to("#dipole-hamiltonian-std", {
            x: "-= 1200",
        })
        timeline.to("#dipole-hamiltonian-renorm", {
            x: "-= 1200",
        }, "<")

        timeline.addLabel("step-2")

        timeline.to(["#dipole-hamiltonian-renorm", "#renormalized-qrm-main", "#renormalized-qrm-reference"], {
            x: "-= 1200",
        })

        timeline.addLabel("step-3")

        timeline.to("#renormalized-qrm-main", {
            left: "24%",
            scale: 0.6,
        })
        timeline.to("#renormalized-qrm-reference", {
            left: "24%",
        }, "<")

        timeline.to(["#renormalized-qrm-anharm", "#mean-squared-deviation"], {
            autoAlpha: 1,
        })

        timeline.addLabel("step-4")
        
        timeline.to(["#renormalized-qrm-main", "#renormalized-qrm-reference", "#renormalized-qrm-anharm", "#mean-squared-deviation"], {
            y: "+= 100",
            autoAlpha: 0,
        })

        timeline.from("#fluxonium-circuit", {
            autoAlpha: 0,
            y: "-= 100",
        }, "<")

        timeline.addLabel("step-5")

        timeline.from("#fluxonium-hamiltonian", {
            autoAlpha: 0,
            scale: 0,
        })

        timeline.addLabel("step-6")

        timeline.fromTo("#fluxonium-potential", {
            autoAlpha: 0,
            scale: 0.2,
        }, {
            autoAlpha: 1,
            scale: 0.4,
        })

        timeline.to("#fluxonium-circuit", {
            x: -350,
            y: -140,
            scale: 0.35,
        }, "<")

        timeline.addLabel("step-7")

        timeline.to("#fluxonium-potential", {
            x: -350,
            y: 90,
            scale: 0.30,
        })

        timeline.fromTo("#fluxonium-eigenvalues", {
            autoAlpha: 0,
            scale: 0.2,
        }, {
            autoAlpha: 1,
            scale: 2.5,
            x: -150,
        }, "<+0.25")

        timeline.addLabel("step-8")

        timeline.to("#fluxonium-eigenvalues", {
            autoAlpha: 0,
        })

        timeline.fromTo("#fluxonium-pi-pulse", {
            autoAlpha: 0,
            scale: 0.2,
        }, {
            autoAlpha: 1,
            scale: 0.45,
            x: "-= 150",
        }, "<+0.25")

        timeline.addLabel("step-9")

    }, slideRef.value)
})

onUnmounted(() => {
    setTimeout(() => {
        ctx.revert()
    }, 500)
})

function GSAPInitializeElements() {
    gsap.set([".latex-formula", "#renormalized-qrm-main", "#fluxonium-circuit", "#fluxonium-potential"], {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
    })

    gsap.set(["#renormalized-qrm-anharm", "#fluxonium-eigenvalues", "#fluxonium-pi-pulse"], {
        top: "50%",
        left: "75%",
        xPercent: -50,
        yPercent: -50,
    })

    gsap.set([".latex-formula", "#renormalized-qrm-main"], {
        scale: 1.25,
    })

    gsap.set(["#renormalized-qrm-anharm"], {
        scale: 1.5,
    })

    gsap.set(["#mean-squared-deviation"], {
        scale: 0.75,
    })

    gsap.set(["#fluxonium-circuit"], {
        scale: 0.5,
    })

    gsap.set(["#fluxonium-hamiltonian"], {
        scale: 0.8,
    })

    gsap.set(["#dipole-hamiltonian-std"], {
        scale: 0
    })

    gsap.set(["#dipole-hamiltonian-std", "#renormalized-qrm-anharm", "#mean-squared-deviation"], {
        autoAlpha: 0,
    })

    gsap.set(["#dipole-hamiltonian-renorm", "#renormalized-qrm-main"], {
        x: "+= 1200",
    })

    setAlignElementTo("#renormalized-qrm-reference", "#renormalized-qrm-main", [0.5, 0.0], [0.5, 0.9]);

    setAlignElementTo("#mean-squared-deviation", "#renormalized-qrm-anharm", [0.5, 0.0], [0.5, 0.9]);

    setAlignElementTo("#fluxonium-hamiltonian", "#fluxonium-circuit", [0.5, 0.0], [0.5, 1.25]);

}


</script>