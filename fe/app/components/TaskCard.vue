<template>
  <button
    type="button"
    class="project-card group w-full text-left"
    :aria-label="`Open task: ${task.title}`"
    @click="$emit('open', task)"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-3 min-w-0">
        <div
          aria-hidden="true"
          class="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-sm"
          :style="chipStyle(task.project_id)"
        >
          {{ projectInitial }}
        </div>

        <div class="min-w-0">
          <p class="truncate text-sm font-bold text-text group-hover:text-brand transition-colors">
            {{ task.title }}
          </p>
          <p class="mt-1 truncate text-[10px] font-bold uppercase tracking-widest text-faint">
            {{ projectName }}
          </p>
        </div>
      </div>

      <span
        class="badge shrink-0"
        :style="chipStyle(task.project_id)"
      >{{ task.status }}</span>
    </div>

    <div class="mt-6 border-t border-border/50 pt-4">
      <div class="flex flex-wrap items-center justify-between gap-2 text-[10px] text-muted">
        <span class="font-mono">
          Due {{ task.due_date ? shortDate(task.due_date) : 'TBD' }}
        </span>
        <span class="font-mono">
          {{ assigneeLabel }}
        </span>
      </div>

      <div class="mt-3 flex items-center justify-between">
        <span
          class="badge px-1.5 py-0.5 text-[9px]"
          :class="priorityClass"
        >{{ task.priority }}</span>

        <span
          class="text-[10px] font-black uppercase tracking-widest"
          :class="statusTone"
        >{{ statusLabel }}</span>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task, TaskStatus } from '~/stores/workspace'
import { useWorkspaceStore } from '~/stores/workspace'

const props = defineProps<{ task: Task }>()

defineEmits<{ open: [task: Task] }>()

const workspace = useWorkspaceStore()
const { chipStyle } = useProjectColor()

const projectName = computed(() => workspace.getProjectById(props.task.project_id)?.name || 'Project')
const projectInitial = computed(() => projectName.value?.[0] || '?')

const assigneeLabel = computed(() => {
  if (!props.task.assignee_id) return 'Unassigned'
  return workspace.getUserById(props.task.assignee_id)?.name || 'Member'
})

const priorityClass = computed(() => {
  switch (props.task.priority) {
    case 'HIGH': return 'badge-expense'
    case 'MEDIUM': return 'badge-warning'
    default: return 'badge-cyan'
  }
})

const statusTone = computed(() => {
  switch (props.task.status) {
    case 'COMPLETED': return 'text-brand'
    case 'ACTIVE': return 'text-cyan'
    case 'PAUSED': return 'text-red'
    default: return 'text-faint'
  }
})

const statusLabel = computed(() => {
  const s: TaskStatus = props.task.status
  if (s === 'PLANNING') return 'Planning'
  if (s === 'ACTIVE') return 'Active'
  if (s === 'PAUSED') return 'Paused'
  return 'Completed'
})

function shortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>
