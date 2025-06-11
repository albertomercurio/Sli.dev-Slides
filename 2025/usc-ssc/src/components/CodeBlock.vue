<script setup>
import { ref, onMounted, computed } from 'vue'
import Prism from 'prismjs'

const props = defineProps({
  code: String,
  language: String
})

const highlightedCode = computed(() => {
  const grammar = Prism.languages[props.language]
  if (grammar) {
    return Prism.highlight(props.code, grammar, props.language)
  }
  return props.code
})
</script>

<template>
  <pre :class="`language-${language}`"><code v-html="highlightedCode"></code></pre>
</template>