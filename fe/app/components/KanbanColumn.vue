<template>
  <section class="dashboard-panel">
    <div class="flex items-end justify-between">
      <div>
        <h2 class="font-display text-lg font-bold text-text">{{ title }}</h2>
        <p class="mt-1 text-[10px] font-bold uppercase tracking-widest text-faint">{{ subtitle }}</p>
      </div>
      <span class="text-[10px] font-mono text-muted">{{ localList.length }}</span>
    </div>

    <div class="mt-5">
      <VueDraggable
        v-model="localList"
        group="production-schedule"
        item-key="id"
        class="space-y-3 min-h-[80px]"
        :animation="150"
        ghost-class="opacity-40"
        @change="onChange"
      >
        <template #item="{ element }">
          <article class="rounded-lg border border-border bg-surface/70 p-3 sketch-border">
            <div class="flex items-start gap-3">
              <div class="mt-1 h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: projectColor(element.project_id) }"></div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-xs font-bold text-text">{{ element.title }}</p>
                <p class="truncate text-[10px] text-muted">{{ element.project_name || 'Project' }}</p>
                <p v-if="element.due_date" class="mt-2 text-[10px] font-mono text-faint">Due {{ element.due_date.slice(0, 10) }}</p>
              </div>
            </div>
          </article>
        </template>

        <template #footer>
          <p v-if="localList.length === 0" class="text-xs text-faint italic">No items in this column.</p>
        </template>
      </VueDraggable>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import type { Task } from '~/stores/workspace'
import { useWorkspaceStore } from '~/stores/workspace'

const workspace = useWorkspaceStore()

const props = defineProps<{ title: string, subtitle: string, modelValue: Task[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: Task[]], moved: [taskId: string] }>()

const localList = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

function onChange(evt: any) {
  // When a task is dropped into this column, sortable emits an "added" record.
  const movedId: string | undefined = evt?.added?.element?.id
  if (movedId) emit('moved', movedId)
}

function projectColor(projectId: string) {
  const p = workspace.projects.find(x => x.id === projectId)
  return p?.color_code || 'rgb(var(--c-border))'
}
</script>
