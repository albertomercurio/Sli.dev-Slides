<script setup>
import CodeBlock from '../src/components/CodeBlock.vue'

const pythonCode = `
def greet(name):
    print(f"Hello, {name}!")
`
</script>

<template>
  <div class="slide">
    <h2>Code blocks are also possible</h2>
    <CodeBlock :code="pythonCode" language="python" />
  </div>
</template>