<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// import Slide1 from '../slides/Slide1.md'
// import Slide2 from '../slides/Slide2.md'
// import Slide3 from '../slides/Slide3.md'
// import Slide4 from '../slides/Slide4.vue'

// const slides = [Slide1, Slide2, Slide3, Slide4]

// Dynamically import all .vue files from the slides directory
const modules = import.meta.glob('../slides/*.vue', { eager: true })
const slides = Object.values(modules).map(module => module.default)

const currentSlideIndex = ref(0)

const currentSlide = computed(() => slides[currentSlideIndex.value])

function nextSlide() {
  if (currentSlideIndex.value < slides.length - 1) {
    currentSlideIndex.value++
  }
}

function prevSlide() {
  if (currentSlideIndex.value > 0) {
    currentSlideIndex.value--
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
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Transition name="fade" mode="out-in">
    <component :is="currentSlide" />
  </Transition>
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