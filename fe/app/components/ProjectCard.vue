<template>
  <article class="project-card group">
    <div class="flex items-start justify-between">
      <div
        aria-hidden="true"
        class="h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg"
        :style="colorStyle"
      >
        {{ project.name?.[0] || '?' }}
      </div>
      <span class="badge" :style="badgeStyle">{{ project.status }}</span>
    </div>

    <h3 class="mt-6 font-display text-lg font-bold text-text group-hover:text-brand transition-colors">
      {{ project.name }}
    </h3>
    <p class="mt-2 text-sm text-muted line-clamp-2 italic">
      {{ project.description || `Standard production environment for ${project.name.toLowerCase()}.` }}
    </p>

    <div class="mt-8 border-t border-border/50 pt-4">
      <div class="mb-3 flex items-center justify-between">
        <div class="flex items-center gap-4 text-[11px] font-bold text-faint">
          <span class="flex items-center gap-1.5">
            <span class="h-1.5 w-1.5 rounded-full" :style="{ backgroundColor: color }" />
            {{ project.card_count }} cards
          </span>
          <span class="flex items-center gap-1.5">
            {{ project.task_count }} tasks
          </span>
        </div>
      </div>

      <div class="flex gap-2">
        <NuxtLink class="btn btn-ghost flex-1 justify-center text-xs" :to="`/projects/${project.id}`">
          {{ openLabel }}
        </NuxtLink>
        <NuxtLink class="btn btn-primary flex-1 justify-center text-xs" :to="`/workspace/${project.id}`">
          {{ workspaceLabel }}
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Project } from '~/stores/workspace'

const props = defineProps<{
  project: Project
  openLabel?: string
  workspaceLabel?: string
}>()

const openLabel = computed(() => props.openLabel || 'Command Sheet')
const workspaceLabel = computed(() => props.workspaceLabel || 'Workspace')

const color = computed(() => props.project.color_code || 'rgb(var(--c-border))')

const colorStyle = computed(() =>
  props.project.color_code
    ? { backgroundColor: props.project.color_code + '20', color: props.project.color_code }
    : undefined
)

const badgeStyle = computed(() =>
  props.project.color_code
    ? { borderColor: props.project.color_code + '40', color: props.project.color_code }
    : undefined
)
</script>
