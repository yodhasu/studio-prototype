<template>
  <article class="dashboard-panel dashboard-panel--interactive flex h-full flex-col justify-between">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-faint">{{ label }}</p>
        <p class="mt-3 font-display text-3xl font-semibold text-text">{{ value }}</p>
      </div>
      <span :class="toneClass" class="badge">{{ trend }}</span>
    </div>
    <div v-if="detail" class="mt-6 space-y-3">
      <p class="text-sm text-muted">{{ detail }}</p>
      <div v-if="progress !== null" class="space-y-2">
        <div class="h-2 overflow-hidden rounded-full bg-white/5">
          <div class="h-full rounded-full bg-brand transition-all duration-500" :style="{ width: `${progress}%` }" />
        </div>
        <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">{{ progress }}% utilized</p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string
  value: string | number
  trend: string
  detail?: string
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral'
  progress?: number | null
}>(), {
  detail: '',
  tone: 'neutral',
  progress: null,
})

const toneClass = computed(() => {
  switch (props.tone) {
    case 'brand':
      return 'badge-brand'
    case 'success':
      return 'badge-income'
    case 'warning':
      return 'badge-warning'
    case 'danger':
      return 'badge-expense'
    default:
      return ''
  }
})
</script>
