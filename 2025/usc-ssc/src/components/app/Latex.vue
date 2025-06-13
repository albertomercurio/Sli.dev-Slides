<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import katex from 'katex'

const props = defineProps({
  // The LaTeX expression to render
  expression: {
    type: String,
    required: true
  },
  // A prop to control inline vs. display mode
  display: {
    type: Boolean,
    default: false
  }
})

const element = ref(null)

// A computed property to select the correct HTML tag
const tag = computed(() => props.display ? 'div' : 'span')

const render = () => {
  if (element.value) {
    katex.render(props.expression, element.value, {
      throwOnError: false,
      displayMode: props.display // Use the prop to set KaTeX's displayMode
    })
  }
}

// Render when the component is mounted and whenever the expression changes
onMounted(render)
watch(() => props.expression, render)
</script>

<template>
  <component :is="tag" ref="element" />
</template>

<style>
.katex-display {
  /* Add some margin to block-level equations for spacing */
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>