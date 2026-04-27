<template>
  <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-panel/20 p-12 text-center transition-colors hover:border-brand/30">
    <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface shadow-sm">
      <slot name="icon">
        <span class="text-xl font-bold text-muted">?</span>
      </slot>
    </div>
    <h3 class="text-sm font-bold text-text">
      {{ title }}
    </h3>
    <p class="mt-1 max-w-sm text-xs text-muted">
      {{ description }}
    </p>
    <div v-if="$slots.action" class="mt-6">
      <slot name="action" />
    </div>
  </div>
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
