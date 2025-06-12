<template>
  <div class="slide">
    <h1> <b>Exploring Ultrastrong and Superstrong Coupling Regimes in Quantum Electrodynamics</b> </h1>

    <hr class="w-full my-6 border-epfl" />

    <p>Presented by: Alberto Mercurio</p>

    <!-- Put BohrAtom component in the bottom-right -->
    <div class="absolute bottom-0 right-0 mr-16 mb-4 flex items-center gap-x-2">
      <CavityMirror />
      <BohrAtom />
      <CavityMirror class="rotate-180" />
    </div>
  </div>
</template>

<script setup>
import CavityMirror from '../src/components/CavityMirror.vue'
import BohrAtom from '../src/components/BohrAtom.vue'

</script>

<style scoped>
.slide {
  /* Basic slide styling */
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>