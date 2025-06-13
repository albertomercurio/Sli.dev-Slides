<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// import Slide1 from '../slides/Slide1.md'
// import Slide2 from '../slides/Slide2.md'
// import Slide3 from '../slides/Slide3.md'
// import Slide4 from '../slides/Slide4.vue'

// const slides = [Slide1, Slide2, Slide3, Slide4]

// Dynamically import all .vue files from the slides directory
const vueModules = import.meta.glob('../slides/*.vue', { eager: true })
const mdModules = import.meta.glob('../slides/*.md', { eager: true })
const slides = [
  ...Object.values(vueModules).map(module => module.default),
  ...Object.values(mdModules).map(module => module.default)
]

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