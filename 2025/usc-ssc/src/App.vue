<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const slideOrder = [
  '01-Intro.vue',
  '02-PhotonAbsorption.vue',
  '03-CavityFabryPerot.vue',
  '04-CavityWaveguide.vue',
  '05-CavityQED.vue',
  '06-JaynesCummings.vue',
  '07-MinimalCoupling.vue',
  'ThankYou.vue'
]

const vueModules = import.meta.glob('../slides/*.vue', { eager: true })

const slides = slideOrder
  .map(name => vueModules[`../slides/${name}`]?.default)
  .filter(Boolean)

const isAppReady = ref(false)
const currentSlideRef = ref(null) // Reference to the current slide component
const currentSlideIndex = ref(0) // Keeps track of the current slide index
const currentSlideStep       = ref(0) // Keeps track of the current step in the slide

const currentSlide = computed(() => slides[currentSlideIndex.value])

function nextSlide() {
  const maxSteps = currentSlideRef.value?.maxSteps ?? 0

  if (currentSlideStep.value < maxSteps) {
    currentSlideStep.value++
    return
  }

  if (currentSlideIndex.value < slides.length - 1) {
    currentSlideIndex.value++
    currentSlideStep.value = 0
  }
}

function prevSlide() {
  if (currentSlideStep.value > 0) {
    currentSlideStep.value--
    return
  }
   if (currentSlideIndex.value > 0) {
    currentSlideIndex.value--
    currentSlideStep.value = slides[currentSlideIndex.value]?.steps ?? 0
   }
}

// --- Keyboard Navigation ---
function handleKeydown(event) {
  if (event.key === 'ArrowRight' || event.key === ' ') {
    nextSlide()
  } else if (event.key === 'ArrowLeft') {
    prevSlide()
  }
}

// Add and remove the event listener to avoid memory leaks
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  requestAnimationFrame(() => {
    // Delay rendering slide by one frame
    isAppReady.value = true
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div v-if="isAppReady"
        id="page-root" class="grid grid-cols-[1fr_max-content]"
        style="touch-action: pan-y;">
    <SlideContainer>
      <Center>
        <Transition name="fade" mode="out-in">
            <component ref="currentSlideRef" :is="currentSlide" :step="currentSlideStep" />
        </Transition>
      </Center>

      <GlobalFrame :current="currentSlideIndex" :total="slides.length" />
    </SlideContainer>
  </div>
</template>

<style>
/* --- Smooth Fade Transition --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>