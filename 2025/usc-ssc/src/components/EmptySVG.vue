<template>
    <svg 
        :width="props.width"
        :height="props.height"
        :viewBox="`0 0 ${props.width} ${props.height}`">
        <path ref="pathRef" fill="none" d="" />
    </svg>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 300,
  height: 300,
})

const pathRef = ref<SVGPathElement | null>(null)

defineExpose({
  pathRef,
})

</script>