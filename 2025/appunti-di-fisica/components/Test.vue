<template>
     <svg ref="rootRef" :width="size" :height="size" :viewBox="viewBox">
        <ellipse
            class="test"
            :cx="center"
            :cy="center"
            :rx="size / 10"
            :ry="size / 15"/>
    </svg>
</template>

<script setup>

import { ref, nextTick } from 'vue'
import { gsap } from 'gsap'
import { onSlideEnter, onSlideLeave } from '@slidev/client'

const props = defineProps({
    size: { type: Number, default: 200 },
})
const center = props.size / 2
const viewBox = `0 0 ${props.size} ${props.size}`

const rootRef = ref(null);
const ctx = ref(null);

defineExpose({
    ctx,
})

onSlideEnter(() => {
    ctx.value = gsap.context(() => {
        // await nextTick(); // Ensure the DOM is updated before accessing rootRef
        gsap.to(".test", {
            x: 50,
            duration: 0.3,
            ease: 'power1.inOut',
            repeat: -1,
            yoyo: true,
        })
    }, rootRef.value)
})

onSlideLeave(() => {
    ctx.value.revert();
})

</script>