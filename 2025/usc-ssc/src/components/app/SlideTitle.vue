<template>
    <component :is="tag" v-if="hasContent" class="absolute inset-x-0 top-0 text-left px-4">
        <slot>{{ text }}</slot>
    </component>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

interface Props {
    text?: string
    tag?: string
}

const props = withDefaults(defineProps<Props>(), {
    text: '',
    tag: 'h1'
})

const slots = useSlots()
const hasContent = computed(() => !!props.text || !!slots.default)
</script>