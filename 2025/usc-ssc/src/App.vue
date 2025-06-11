<script setup>
import { ref, computed } from 'vue'
import Slide1 from '../slides/Slide1.vue'
import Slide2 from '../slides/Slide2.vue'
import Slide3 from '../slides/Slide3.vue'
import Slide4 from '../slides/Slide4.vue'

const slides = [Slide1, Slide2, Slide3, Slide4]
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
</script>

<template>
  <main>
    <component :is="currentSlide" />
    <div class="navigation">
      <button @click="prevSlide">Previous</button>
      <button @click="nextSlide">Next</button>
    </div>
  </main>
</template>

<style>
main {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.navigation {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}
</style>