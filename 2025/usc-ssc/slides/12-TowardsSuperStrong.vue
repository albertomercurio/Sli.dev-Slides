<template>
    <div ref="slideRef" class="slide">
        <SlideTitle>Towards Super Strong Coupling</SlideTitle>

        <Arrow id="arrow-weak-strong" class="absolute" :start="{ x: 200, y: 150 }" :end="{ x: 980-200, y: 150 }" />
        <Latex id="latex-weak" class="absolute latex-formula" expression="g < \gamma" :display="true" />
        <Latex id="latex-strong" class="absolute latex-formula" expression="g > \gamma" :display="true" />

        <Arrow id="arrow-usc-dsc" class="absolute" :start="{ x: 200, y: 270 }" :end="{ x: 980-200, y: 270 }" />
        <Latex id=latex-usc class="absolute latex-formula" expression="g > \frac{\omega_c}{10}" :display="true" />
        <Latex id=latex-dsc class="absolute latex-formula" expression="g > \omega_c" :display="true" />

        <div id="weak-label" class="absolute text-slate-600">
            Weak Coupling
        </div>
        <div id="strong-label" class="absolute text-slate-600">
            Strong Coupling
        </div>

        <div id="usc-label" class="absolute text-slate-600">
            Ultra Strong Coupling
        </div>
        <div id="dsc-label" class="absolute text-slate-600">
            Deep Strong Coupling
        </div>

        <Arrow id="arrow-ssc" class="absolute" :start="{ x: 200, y: 400 }" :end="{ x: 980-200, y: 400 }" />

        <Latex id="latex-ssc" class="absolute latex-formula" expression="g > \Delta \omega" :display="true" />

        <div id="ssc-label" class="absolute text-slate-600">
            Super Strong Coupling
        </div>

        <CavityMirror id="cavity-mirror-left" class="absolute" />
        <CavityMirror id="cavity-mirror-right" class="absolute" />
        <Latex id="latex-cavity-fsr" class="absolute latex-formula" expression="\Delta \omega = \frac{c}{2 L}" :display="true" />

        <CavityMirror v-for="i in totalCavities" :key="`cavity-mirror-left-${i}`" 
                        :id="`cavity-mirror-left-${i}`"
                        class="absolute cavity-mirror-left" ref="cavityMirrorLeftRef"
                        :size="30" />
        <CavityMirror v-for="i in totalCavities" :key="`cavity-mirror-right-${i}`" 
                        :id="`cavity-mirror-right-${i}`"
                        class="absolute cavity-mirror-right" ref="cavityMirrorRightRef"
                        :size="30" />

        <!-- Curved Arrows-->
        <svg v-for="i in (totalCavities-1)" :key="`curved-arrow-${i}`" :id="`curved-arrow-${i}`" class="absolute hopping-arrows" width="200" height="250" viewBox="0 0 300 150">
        <!-- Re-usable arrow-head, scaled up -->
        <defs>
            <marker id="arrowHead"
                    viewBox="0 0 12 12"
                    refX="6" refY="6"
                    markerWidth="10" markerHeight="10"
                    orient="auto-start-reverse">
            <path d="M0,0 L12,6 L0,12 Z" fill="black"/>
            </marker>
        </defs>

        <!-- Curved path from (50,100) to (250,100) via control (150,20) -->
        <path d="M 50 100 Q 150 20 250 100"
                fill="none"
                stroke="black"
                stroke-width="2"
                marker-start="url(#arrowHead)"
                marker-end="url(#arrowHead)" />
        </svg>

        <Latex v-for="i in (totalCavities-1)" :key="`latex-hopping-${i}`"
                :id="`latex-hopping-${i}`"
                class="absolute latex-formula latex-hopping"
                expression="J"
                :display="true" />

        <!--  Standing Modes -->
        <EmptySVG v-for="i in nCavityModes" ref="cavityModeRefs" :key="`mode-${i}`"
            :width="modeSVGWidth" :height="modeSVGHeight"
            class="cavity-mode absolute" />

        <Latex id="cca-fsr" class="absolute latex-formula" expression="\Delta \omega = 4 J / N" :display="true" />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { linrange, getCoordinates, setAlignElementTo, drawSVG } from '../src/utils/utils.js'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
gsap.registerPlugin(DrawSVGPlugin)
gsap.registerPlugin(MotionPathPlugin)

const slideRef = ref(null)
const ctx = gsap.context(() => { }, slideRef.value)
const cavityMirrorLeftRef = ref([])
const cavityMirrorRightRef = ref([])
const cavityModeRefs = ref([])

// Coupled Cavity Array Properties
const totalCavities = 5
const nCavityModes = 3
const modeSVGWidth = 900
const modeSVGHeight = 120
const modeColors = ['#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51', '#A8DADC', '#457B9D'];

const maxSteps = ref(9); // Maximum steps for the slide
const props = defineProps({
  step: { type: Number, required: true }
})
defineExpose({
  maxSteps
});

onMounted(() => {
    ctx.add(() => {
        const mirrorColor = gsap.getProperty(".cavity-mirror-left  .cavity-mirror", "fill")
        GSAPInitializeElements()
        const modePaths = initializeCavityModes(nCavityModes, modeSVGWidth, modeSVGHeight, modeColors)

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

        timeline.fromTo([
            "#arrow-weak-strong",
            "#latex-weak",
            "#latex-strong",
            "#weak-label",
            "#strong-label"
        ], {
            autoAlpha: 0,
            x: "-= 1200",
        }, {
            autoAlpha: 1,
            x: "+= 1200",
        })

        timeline.addLabel("step-1")

        timeline.fromTo([
            "#arrow-usc-dsc",
            "#latex-usc",
            "#latex-dsc",
            "#usc-label",
            "#dsc-label"
        ], {
            autoAlpha: 0,
            x: "-= 1200",
        }, {
            autoAlpha: 1,
            x: "+= 1200",
        })

        timeline.addLabel("step-2")

        timeline.fromTo([
            "#arrow-ssc",
            "#latex-ssc",
            "#ssc-label"
        ], {
            autoAlpha: 0,
            x: "-= 1200",
        }, {
            autoAlpha: 1,
            x: "+= 1200",
        })

        timeline.addLabel("step-3")

        timeline.to(["#arrow-weak-strong", "#latex-weak", "#latex-strong", "#weak-label", "#strong-label",
                      "#arrow-usc-dsc", "#latex-usc", "#latex-dsc", "#usc-label", "#dsc-label",
                      "#arrow-ssc", "#latex-ssc", "#ssc-label"], {
            autoAlpha: 0,
        })

        drawSVG(
            timeline,
            ["#cavity-mirror-left .cavity-mirror", "#cavity-mirror-right .cavity-mirror"],
            mirrorColor,
            "100%",
            0.3
        )

        timeline.addLabel("step-4")

        timeline.fromTo("#latex-cavity-fsr", {
            autoAlpha: 0,
        }, {
            autoAlpha: 1,
        })

        timeline.addLabel("step-5")

        drawSVG(
            timeline,
            [".cavity-mirror-left .cavity-mirror", ".cavity-mirror-right .cavity-mirror"],
            mirrorColor,
            "100%",
            0.1
        )

        timeline.addLabel("step-6")

        timeline.fromTo([".hopping-arrows", ".latex-hopping"], {
            autoAlpha: 0,
        }, {
            autoAlpha: 1,
        })

        timeline.addLabel("step-7")

        timeline.to(modePaths, {
            drawSVG: "100%",
            stagger: 0.4,
        })

        timeline.call(() => {
            modePaths.forEach((path, i) => {
                gsap.to(path, {
                scaleY: -1,
                duration: 2 / (i + 1),
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                svgOrigin: "0 0",
                })
            })
        })

        timeline.addLabel("step-8")

        timeline.fromTo("#cca-fsr", {
            autoAlpha: 0,
        }, {
            autoAlpha: 1,
        })

        timeline.addLabel("step-9")

    }, slideRef.value)
})

onUnmounted(() => {
    setTimeout(() => {
        ctx.revert()
    }, 500)
})

function GSAPInitializeElements() {
    gsap.set("#latex-weak", {
        x: -200,
        y: -175,
    })
    gsap.set("#latex-strong", {
        x: 150,
        y: -175,
    })
    gsap.set("#latex-usc", {
        x: -200,
        y: 60-130,
    })
    gsap.set("#latex-dsc", {
        x: 150,
        y: 70-130,
    })

    gsap.set("#weak-label", {
        x: -200,
        y: -130,
    })
    
    gsap.set("#latex-ssc", {
        x: -30,
        y: 70,
    })

    setAlignElementTo("#weak-label", "#latex-weak", [0.5, 0.0], [0.5, 1],)

    setAlignElementTo("#strong-label", "#latex-strong", [0.5, 0.0], [0.5, 1],)

    setAlignElementTo("#usc-label", "#latex-usc", [0.5, 0.0], [0.5, 1],)

    setAlignElementTo("#dsc-label", "#latex-dsc", [0.5, 0.0], [0.5, 1],)

    setAlignElementTo("#ssc-label", "#latex-ssc", [0.5, 0.0], [0.5, 1],)

    // Main Cavity Initialization

    gsap.set(["#cavity-mirror-left", "#cavity-mirror-right"], {
        top: "30%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
    })

    gsap.set("#cavity-mirror-right", {
        x: 100,
        rotation: 180,
    })

    gsap.set("#cavity-mirror-left", {
        x: -100,
    })

    setAlignElementTo("#latex-cavity-fsr", ["#cavity-mirror-left", "#cavity-mirror-right"])

    gsap.set(["#cavity-mirror-left .cavity-mirror", "#cavity-mirror-right .cavity-mirror"], {
        drawSVG: "0%",
        fill: "#00000000",
    })


    // Coupled Cavity Array Initialization

    gsap.set(".cavity-mirror-left", {
        x: (i) => {
            return -460 + (i * 200)
        },
        y: "+= 80",
    })

    gsap.set(".cavity-mirror-right", {
        x: (i) => {
            return -360 + (i * 200)
        },
        y: "+= 80",
        rotation: 180,
    })

    // Curved Arrows Initialization

    gsap.set(".hopping-arrows", {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        x: (i) => {
            return -300 + (i * 200)
        },
        y: 50,
    })

    gsap.set(".latex-hopping", {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        x: (i) => {
            return -300 + (i * 200)
        },
        y: 30,
    })
    
    gsap.set(".cavity-mode", {
        left: "50%",
        top:  "50%",
        xPercent: -50,
        yPercent: -50,
        x: 6,
        y: 120,
    })

    gsap.set([".cavity-mirror-left .cavity-mirror", ".cavity-mirror-right .cavity-mirror"], {
        drawSVG: "0%",
        fill: "#00000000",
    })

    gsap.set("#cca-fsr", {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        y: 200,
    })
}

function initializeCavityModes(nCavityModes, modeSVGWidth, modeSVGHeight, modeColors) {
  const xList = linrange(0, modeSVGWidth, 30);
  const kList = Array.from({ length: nCavityModes }, (_, i) => (i + 1) * Math.PI / modeSVGWidth);
  const fList = kList.map(k => x => modeSVGHeight * Math.sin(k * x) / 3);

  const modePaths = cavityModeRefs.value.map((ref) => ref.pathRef[0]);

  const coordinatesList = fList.map(f => getCoordinates(f, xList));
  const rawPathList = coordinatesList.map(coords => MotionPathPlugin.arrayToRawPath(coords));
  const dList = rawPathList.map(rawPath => MotionPathPlugin.rawPathToString(rawPath));

  gsap.set(modePaths, {
    drawSVG: "0%",
    attr: {
      d: (i) => {return dList[i]},
      stroke: (i) => {return modeColors[i % modeColors.length]},
    },
    strokeWidth: 3,
  })

  return modePaths
}

</script>