<template>
  <span
    class="badge"
    :class="[
      variant === 'brand' ? 'badge-brand' : '',
      variant === 'income' ? 'badge-income' : '',
      variant === 'warning' ? 'badge-warning' : '',
      variant === 'expense' ? 'badge-expense' : '',
      variant === 'cyan' ? 'badge-cyan' : '',
      variant === 'default' ? '' : ''
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  variant: {
    type: String as PropType<'brand' | 'income' | 'warning' | 'expense' | 'cyan' | 'default'>,
    default: 'default'
  }
})
</script>
