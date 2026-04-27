<template>
  <header class="flex items-end justify-between">
    <div>
      <h2 class="font-display text-lg font-black tracking-tight text-text lg:text-xl">
        {{ title }}
      </h2>
      <p v-if="description" class="mt-1 text-xs text-muted">
        {{ description }}
      </p>
    </div>
    <div v-if="$slots.action" class="shrink-0">
      <slot name="action" />
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
})
</script>
