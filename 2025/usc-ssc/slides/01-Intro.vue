<template>
  <div class="slide">
    <div class="translate-y-[-3rem]">
      <h2> Exploring Ultrastrong and Superstrong Coupling Regimes in Quantum Electrodynamics </h2>

      <hr class="w-full my-6 border-epfl" />

      <p>Alberto Mercurio</p>
    </div>
    
    <!-- Put BohrAtom component in the bottom-right -->
    <div class="absolute bottom-0 right-0 mr-16 mb-4 flex items-center gap-x-2">
      <CavityMirror />
      <BohrAtom :size=150 />
      <CavityMirror class="rotate-180" />
    </div>
  </div>
</template>
