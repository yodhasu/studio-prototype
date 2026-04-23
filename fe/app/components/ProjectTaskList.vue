<template>
  <div class="flex h-full min-h-0 flex-col gap-3">
    <div class="flex items-center justify-between px-1">
      <div class="flex items-center gap-2.5">
        <span class="text-[10px] font-black uppercase tracking-[0.18em] text-muted">Active Tasks</span>
        <span class="rounded-full bg-brand/10 px-1.5 py-0.5 text-[9px] font-bold text-brand">{{ projectTasks.length }}</span>
      </div>
      <button
        class="flex items-center gap-1.5 border border-border/40 bg-surface-elevated px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-muted shadow-sm transition-all hover:border-brand/40 hover:bg-surface hover:text-brand"
        @click="createTask"
      >
        <Plus class="h-3 w-3" />
        Add Task
      </button>
    </div>

    <div class="custom-scrollbar min-h-0 flex-1 overflow-y-auto pr-2">
      <TransitionGroup
        name="list"
        tag="div"
        class="space-y-2"
      >
        <button
          v-for="task in projectTasks"
          :key="task.id"
          type="button"
          class="group flex w-full items-center gap-3 rounded-xl border border-border/30 bg-surface/30 p-3 text-left transition-all hover:border-brand/40 hover:bg-surface-elevated"
          :aria-label="`View details for task: ${task.title}`"
          @click="openTask(task)"
        >
          <div
            class="h-8 w-1.5 rounded-full"
            :class="getPriorityClass(task.priority)"
          />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-bold text-text">
              {{ task.title }}
            </p>
            <div class="mt-1 flex items-center gap-2">
              <span
                class="badge px-1.5 py-0.5 text-[9px]"
                :class="getStatusClass(task.status)"
              >
                {{ task.status }}
              </span>
              <span class="flex items-center gap-1 font-medium text-muted text-[10px]">
                <Calendar class="h-2.5 w-2.5" /> Due {{ task.due_date ? formatDate(task.due_date) : 'TBD' }}
              </span>
            </div>
          </div>
          <ArrowUpRight class="h-4 w-4 text-faint transition-colors group-hover:text-brand" />
        </button>
      </TransitionGroup>

      <div
        v-if="projectTasks.length === 0"
        class="rounded-xl border border-dashed border-border/50 p-4 text-center text-sm italic text-faint"
      >
        No active tasks for this project.
      </div>
    </div>

    <TaskModal
      v-model:open="isModalOpen"
      :task="selectedTask"
      :project-id="projectId"
      :initial-mode="modalMode"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Calendar, ArrowUpRight } from 'lucide-vue-next'
import { useWorkspaceStore } from '~/stores/workspace'
import type { Task, TaskStatus } from '~/stores/workspace'

const props = defineProps<{
  projectId: string
}>()

const workspace = useWorkspaceStore()
const isModalOpen = ref(false)
const modalMode = ref<'create' | 'detail' | 'edit'>('detail')
const selectedTask = ref<Task | null>(null)

const projectTasks = computed(() => {
  return workspace.tasks
    .filter(t => t.project_id === props.projectId)
    .filter(t => t.status !== 'COMPLETED')
    .sort((a, b) => {
      const dateA = a.due_date ? new Date(a.due_date).getTime() : Number.POSITIVE_INFINITY
      const dateB = b.due_date ? new Date(b.due_date).getTime() : Number.POSITIVE_INFINITY
      if (dateA !== dateB) return dateA - dateB

      const priorityMap = { HIGH: 3, MEDIUM: 2, LOW: 1 }
      return priorityMap[b.priority] - priorityMap[a.priority]
    })
})

function getPriorityClass(priority: string) {
  switch (priority) {
    case 'HIGH': return 'bg-red'
    case 'MEDIUM': return 'bg-amber'
    default: return 'bg-cyan'
  }
}

function getStatusClass(status: TaskStatus) {
  switch (status) {
    case 'COMPLETED': return 'badge-income'
    case 'ACTIVE': return 'badge-cyan'
    case 'PAUSED': return 'badge-expense'
    default: return ''
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function openTask(task: Task) {
  selectedTask.value = task
  modalMode.value = 'detail'
  isModalOpen.value = true
}

function createTask() {
  selectedTask.value = null
  modalMode.value = 'create'
  isModalOpen.value = true
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
