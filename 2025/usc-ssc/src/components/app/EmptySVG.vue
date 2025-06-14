<template>
    <svg 
        :width="props.width"
        :height="props.height"
        :viewBox="computedViewBox">
        <path ref="pathRef" fill="none" d="" />
    </svg>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  width?: number
  height?: number
  viewBox?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 300,
  height: 300,
})

const computedViewBox = computed(() => {
  if (props.viewBox) {
    return props.viewBox;
  }
  return `0 ${-props.height / 2} ${props.width} ${props.height}`;
})

const pathRef = ref<SVGPathElement | null>(null)

defineExpose({
  pathRef,
})

</script>