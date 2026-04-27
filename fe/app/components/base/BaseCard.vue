<template>
  <article
    class="rounded-[var(--r-lg)] border border-border bg-surface p-5 transition-all duration-300"
    :class="[
      interactive ? 'cursor-pointer hover:-translate-y-[2px] hover:border-border-hi hover:shadow-card' : ''
    ]"
  >
    <slot />
  </article>
</template>

<script setup lang="ts">
defineProps({
  interactive: {
    type: Boolean,
    default: false
  }
})
</script>
