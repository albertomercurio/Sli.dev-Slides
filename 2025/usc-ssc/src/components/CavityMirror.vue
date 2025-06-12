<template>
  <!-- maintain the original aspect ratio (600.53 × 1671) -->
  <svg
    :width="props.size"
    :height="(+props.size) * 1671 / 600.53"
    viewBox="0 0 600.53 1671"
    aria-hidden="true"
  >
    <path
      class="cavity-mirror"
      :fill="props.fill"
      :stroke="props.stroke"
      stroke-miterlimit="10"
      d="M543.64,1670.5H56.77c-31.07,0-56.27-25.19-56.27-56.27V56.77C.5,25.69,25.69.5,56.77.5h486.88c45.5,0,
         72.24,51.24,46.12,88.49-349.02,497.67-349.02,995.35,0,1493.02,26.12,37.25-.62,88.49-46.12,88.49Z"
    />
  </svg>
</template>

<script setup>
const props = defineProps({
    size: { type: Number, default: 80 },
    stroke: { type: String, default: '#1d1d1b' },
    fill: { type: String, default: '#a2a2a2' },
})
</script>

<style scoped>
svg {
  display: block;
}

.cavity-mirror {
  stroke-width: 0;
}
</style>