<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between px-1">
      <span class="text-xs font-bold text-muted uppercase tracking-wider">Active Tasks</span>
      <span class="text-xs text-faint">{{ projectTasks.length }} Total</span>
    </div>

    <div 
      class="space-y-2 transition-all duration-300 overflow-y-auto custom-scrollbar"
      :class="{ 'max-h-[400px] pr-2': isExpanded }"
    >
      <div 
        v-for="task in displayedTasks" 
        :key="task.id"
        class="flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-surface/30 hover:bg-surface-elevated hover:border-brand/40 transition-all cursor-pointer group"
        @click="openTask(task)"
      >
        <div class="w-1.5 h-8 rounded-full" :class="getPriorityClass(task.priority)" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-text truncate">{{ task.card_title }}</p>
          <div class="flex items-center gap-2 mt-1">
            <UBadge size="xs" :color="getStatusColor(task.status)" variant="subtle">{{ task.status }}</UBadge>
            <span class="text-[10px] text-muted font-medium flex items-center gap-1">
              <Calendar class="w-2.5 h-2.5" /> Due {{ formatDate(task.due_date) }}
            </span>
          </div>
        </div>
        <ArrowUpRight class="w-4 h-4 text-faint group-hover:text-brand transition-colors" />
      </div>

      <div v-if="projectTasks.length === 0" class="p-4 text-center rounded-xl border border-dashed border-border/50 text-sm text-faint italic">
        No active tasks for this project.
      </div>
    </div>

    <button 
      v-if="projectTasks.length > 3"
      class="flex items-center justify-center gap-2 py-2 text-xs font-bold text-muted hover:text-brand transition-colors"
      @click="isExpanded = !isExpanded"
    >
      <ChevronDown class="w-4 h-4 transition-transform duration-300" :class="{ 'rotate-180': isExpanded }" />
      {{ isExpanded ? 'Show Less' : `Show all (${projectTasks.length})` }}
    </button>

    <TaskDetailModal v-model="isDetailOpen" :task="selectedTask" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Calendar, ArrowUpRight, ChevronDown } from 'lucide-vue-next'
import { useWorkspaceStore } from '~/stores/workspace'
import type { Task } from '~/stores/workspace'

const props = defineProps<{
  projectId: string
}>()

const workspace = useWorkspaceStore()
const isExpanded = ref(false)
const isDetailOpen = ref(false)
const selectedTask = ref<Task | null>(null)

const projectTasks = computed(() => {
  return workspace.tasks
    .filter(t => t.project_id === props.projectId)
    .sort((a, b) => {
      // Sort by due date first
      const dateA = new Date(a.due_date).getTime()
      const dateB = new Date(b.due_date).getTime()
      if (dateA !== dateB) return dateA - dateB
      
      // Then by priority
      const priorityMap = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 }
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
    case 'HIGH': return 'bg-red-500'
    case 'MEDIUM': return 'bg-amber-500'
    default: return 'bg-blue-500'
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'DONE': return 'green'
    case 'PROGRESS': return 'blue'
    case 'BLOCKED': return 'red'
    default: return 'gray'
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function openTask(task: Task) {
  selectedTask.value = task
  isDetailOpen.value = true
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
