<template>
    <svg 
        :width="props.width"
        :height="props.height"
        :viewBox="computedViewBox">
        <path v-for="n in props.nPaths" 
              :key="`path-${n}`"
              ref="pathRef"
              class="empty-svg-path"
              fill="none"
              d=""
              />
    </svg>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  width?: number
  height?: number
  viewBox?: string
  nPaths?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 300,
  height: 300,
  nPaths: 1,
})

const computedViewBox = computed(() => {
  if (props.viewBox) {
    return props.viewBox;
  }
  return `0 ${-props.height / 2} ${props.width} ${props.height}`;
})

const pathRef = ref<SVGPathElement[]>([])

defineExpose({
  pathRef,
})

</script>

<style scoped>
.empty-svg-path {
    stroke-width: 0.05;
}
</style>