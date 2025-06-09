<template view-transition-name: none>
  <img src="/images/EPFL_Logo.svg" class="absolute bottom-0 left-0 w-[10%] m-8" />
  <div class="absolute bottom-0 left-0 h-1 bg-epfl transition-all duration-700 ease-in-out static-vt"
       :style="{ width: ($nav.currentPage - 1) / ($nav.total - 1) * 100 + '%' }"></div>
  <div
    v-if="$nav.currentPage !== 1"
    class="absolute bottom-0 right-0 m-8 bg-epfl text-white rounded-full w-6 h-6 flex items-center justify-center"
  >
    {{ $nav.currentPage }}
  </div>
</template>

<script setup>

</script>
