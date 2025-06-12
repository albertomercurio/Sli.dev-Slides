<script setup>
import Latex from '../src/components/Latex.vue'
</script>

<template>
  <div class="text-2xl text-left">
    <h1 class="text-5xl font-bold mb-8 text-center">Maxwell's Equations</h1>

    <p class="leading-relaxed">
      In physics, Maxwell's equations are a set of coupled partial differential
      equations that, together with the Lorentz force law, form the foundation
      of classical electromagnetism. For example, Gauss's law for magnetism is
      written as <Latex expression="\nabla \cdot \mathbf{B} = 0" />, which shows that
      there are no magnetic monopoles.
    </p>

    <p class="mt-4">
      The integral form of Ampère's circuital law is given by:
    </p>

    <Latex
      expression="\oint_C \mathbf{B} \cdot d\mathbf{l} = \mu_0 \left( I_{\text{enc}} + \epsilon_0 \frac{d\Phi_E}{dt} \right)"
      :display="true"
      class="text-4xl"
    />

    <p class="mt-4">
      This is how you can seamlessly mix inline text with beautiful, clean equations.
    </p>
  </div>
</template>