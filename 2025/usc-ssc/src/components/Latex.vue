<script setup>
import { ref, onMounted, watch } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'

const props = defineProps({
  expression: String
})

const latexContainer = ref(null)

const renderLatex = () => {
  if (latexContainer.value) {
    katex.render(props.expression, latexContainer.value, {
      throwOnError: false
    })
  }
}

onMounted(renderLatex)
watch(() => props.expression, renderLatex)
</script>

<template>
  <div ref="latexContainer"></div>
</template>