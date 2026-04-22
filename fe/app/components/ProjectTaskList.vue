<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between px-1">
      <div class="flex items-center gap-2.5">
        <span class="text-[10px] font-black text-muted uppercase tracking-[0.18em]">Active Tasks</span>
        <span class="bg-brand/10 text-brand text-[9px] font-bold px-1.5 py-0.5 rounded-full">{{ projectTasks.length }}</span>
      </div>
      <button
        class="flex items-center gap-1.5 px-3 py-1 bg-surface-elevated hover:bg-surface border border-border/40 hover:border-brand/40 sketch-border text-[9px] font-bold uppercase tracking-widest text-muted hover:text-brand transition-all shadow-sm"
        @click="createTask"
      >
        <Plus class="w-3 h-3" />
        Add Task
      </button>
    </div>

    <div
      class="transition-all duration-300 overflow-y-auto custom-scrollbar"
      :class="{ 'max-h-[400px] pr-2': isExpanded }"
    >
      <TransitionGroup
        name="list"
        tag="div"
        class="space-y-2"
      >
        <div
          v-for="task in displayedTasks"
          :key="task.id"
          class="flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-surface/30 hover:bg-surface-elevated hover:border-brand/40 transition-all cursor-pointer group"
          :aria-label="`View details for task: ${task.title}`"
          @click="openTask(task)"
        >
          <div
            class="w-1.5 h-8 rounded-full"
            :class="getPriorityClass(task.priority)"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-text truncate">
              {{ task.title }}
            </p>
            <div class="flex items-center gap-2 mt-1">
              <UBadge
                size="xs"
                :color="getStatusColor(task.status)"
                variant="subtle"
              >
                {{ task.status }}
              </UBadge>
              <span class="text-[10px] text-muted font-medium flex items-center gap-1">
                <Calendar class="w-2.5 h-2.5" /> Due {{ task.due_date ? formatDate(task.due_date) : 'TBD' }}
              </span>
            </div>
          </div>
          <ArrowUpRight class="w-4 h-4 text-faint group-hover:text-brand transition-colors" />
        </div>
      </TransitionGroup>

      <div
        v-if="projectTasks.length === 0"
        class="p-4 text-center rounded-xl border border-dashed border-border/50 text-sm text-faint italic"
      >
        No active tasks for this project.
      </div>
    </div>

    <button
      v-if="projectTasks.length > 3"
      class="flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-muted hover:text-brand transition-all border border-border/40 bg-surface/20 hover:bg-surface-elevated rounded-lg mt-1"
      @click="isExpanded = !isExpanded"
    >
      <ChevronDown
        class="w-4 h-4 transition-transform duration-300"
        :class="{ 'rotate-180': isExpanded }"
      />
      {{ isExpanded ? 'Show Less' : `Show all (${projectTasks.length})` }}
    </button>

    <TaskModal
      v-model:open="isModalOpen"
      :task="selectedTask"
      :project-id="projectId"
      :initial-mode="modalMode"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Calendar, ArrowUpRight, ChevronDown } from 'lucide-vue-next'
import { useWorkspaceStore } from '~/stores/workspace'
import type { Task, TaskStatus } from '~/stores/workspace'

const props = defineProps<{
  projectId: string
}>()

const workspace = useWorkspaceStore()
const isExpanded = ref(false)
const isModalOpen = ref(false)
const modalMode = ref<'create' | 'detail' | 'edit'>('detail')
const selectedTask = ref<Task | null>(null)

const projectTasks = computed(() => {
  return workspace.tasks
    .filter(t => t.project_id === props.projectId)
    .sort((a, b) => {
      // Sort by due date first
      const dateA = a.due_date ? new Date(a.due_date).getTime() : Number.POSITIVE_INFINITY
      const dateB = b.due_date ? new Date(b.due_date).getTime() : Number.POSITIVE_INFINITY
      if (dateA !== dateB) return dateA - dateB

      // Then by priority
      const priorityMap = { HIGH: 3, MEDIUM: 2, LOW: 1 }
      return priorityMap[b.priority] - priorityMap[a.priority]
    })
})

const displayedTasks = computed(() => {
  if (isExpanded.value) {
    return projectTasks.value
  }
  return projectTasks.value.slice(0, 3)
})

function getPriorityClass(priority: string) {
  switch (priority) {
    case 'HIGH': return 'bg-red'
    case 'MEDIUM': return 'bg-amber'
    default: return 'bg-cyan'
  }
}

function getStatusColor(status: TaskStatus): 'success' | 'info' | 'error' | 'neutral' {
  switch (status) {
    case 'DONE': return 'success'
    case 'PROGRESS': return 'info'
    case 'BLOCKED': return 'error'
    default: return 'neutral'
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
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

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
