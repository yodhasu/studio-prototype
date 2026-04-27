<template>
  <button
    :type="type"
    class="btn"
    :class="[
      variant === 'primary' ? 'btn-primary' : '',
      variant === 'secondary' ? '' : '',
      variant === 'ghost' ? 'btn-ghost' : '',
      variant === 'danger' ? 'border-transparent bg-red/10 text-red hover:bg-red/20 hover:-translate-y-[1px] shadow-sm' : '',
      size === 'sm' ? 'px-3 py-1.5 text-xs' : '',
      size === 'md' ? 'px-5 py-2.5 text-sm' : '',
      size === 'lg' ? 'px-6 py-3 text-base' : '',
      block ? 'w-full flex justify-center' : '',
      icon ? 'btn-icon' : ''
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  variant: {
    type: String as PropType<'primary' | 'secondary' | 'ghost' | 'danger'>,
    default: 'secondary'
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    default: 'md'
  },
  type: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button'
  },
  block: {
    type: Boolean,
    default: false
  },
  icon: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>
