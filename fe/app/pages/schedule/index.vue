<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <header class="flex items-end justify-between">
        <div>
          <h1 class="font-display text-2xl font-bold tracking-tight text-text">
            Schedule
          </h1>
          <p class="mt-1 text-sm text-muted">
            Kanban for production flow, calendar for date-bound visibility.
          </p>
        </div>

        <div class="flex items-center gap-2 sketch-border bg-surface p-1">
          <button
            class="px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg"
            :class="mode === 'kanban' ? 'bg-panel/40 text-text' : 'text-faint hover:text-muted'"
            @click="mode = 'kanban'"
          >
            Kanban
          </button>
          <button
            class="px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg"
            :class="mode === 'calendar' ? 'bg-panel/40 text-text' : 'text-faint hover:text-muted'"
            @click="mode = 'calendar'"
          >
            Calendar
          </button>
        </div>
      </header>

      <!-- Kanban view -->
      <section
        v-if="mode === 'kanban'"
        class="space-y-6"
      >
        <div class="grid grid-cols-1 gap-6 xl:grid-cols-4">
          <KanbanColumn
            v-model="draftList"
            title="Draft"
            subtitle="TODO"
            @moved="(id) => setStatus(id, 'TODO')"
          />
          <KanbanColumn
            v-model="reviewList"
            title="Review"
            subtitle="PROGRESS"
            @moved="(id) => setStatus(id, 'PROGRESS')"
          />
          <KanbanColumn
            v-model="polishList"
            title="Polish"
            subtitle="BLOCKED"
            @moved="(id) => setStatus(id, 'BLOCKED')"
          />
          <KanbanColumn
            v-model="finalList"
            title="Final"
            subtitle="DONE"
            @moved="(id) => setStatus(id, 'DONE')"
          />
        </div>

        <p class="text-xs text-faint italic">
          Drag between columns updates task status.
        </p>
      </section>

      <!-- Calendar view (week list) -->
      <section
        v-else
        class="dashboard-panel"
      >
        <h2 class="text-xs font-bold uppercase tracking-widest text-muted">
          Week View
        </h2>
        <div class="mt-6 space-y-4">
          <div
            v-for="day in weekDays"
            :key="day.iso"
            class="sketch-border bg-panel/20 p-4"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-faint">
                  {{ day.weekday }}
                </p>
                <p class="mt-1 text-sm font-bold text-text">
                  {{ day.label }}
                </p>
              </div>
              <span class="text-[10px] font-mono text-muted">{{ day.iso }}</span>
            </div>

            <div class="mt-4 space-y-2">
              <NuxtLink
                v-for="t in tasksByDueDate(day.iso)"
                :key="t.id"
                class="flex items-center gap-3 rounded-lg border border-border bg-surface/60 p-3 hover:border-brand/30 transition-colors"
                :to="`/projects/${t.project_id}`"
              >
                <div
                  class="h-2 w-2 rounded-full"
                  :style="{ backgroundColor: projectColor(t.project_id) }"
                />
                <div class="min-w-0 flex-1">
                  <p class="truncate text-xs font-bold text-text">{{ t.title }}</p>
                  <p class="truncate text-[10px] text-muted">{{ t.project_name || 'Project' }} • {{ t.status }}</p>
                </div>
              </NuxtLink>

              <p
                v-if="tasksByDueDate(day.iso).length === 0"
                class="text-xs text-faint italic"
              >
                No date-bound items.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useWorkspaceStore, type Task, type TaskStatus } from '~/stores/workspace'
import { useWorkspaceBoot } from '~/composables/useWorkspaceBoot'

const workspace = useWorkspaceStore()
const { ensureSession } = useWorkspaceBoot()

const mode = ref<'kanban' | 'calendar'>('kanban')

const draftList = ref<Task[]>([])
const reviewList = ref<Task[]>([])
const polishList = ref<Task[]>([])
const finalList = ref<Task[]>([])

function syncFromStore() {
  draftList.value = workspace.tasks.filter(t => t.status === 'TODO')
  reviewList.value = workspace.tasks.filter(t => t.status === 'PROGRESS')
  polishList.value = workspace.tasks.filter(t => t.status === 'BLOCKED')
  finalList.value = workspace.tasks.filter(t => t.status === 'DONE')
}

watch(() => workspace.tasks.map(t => `${t.id}:${t.status}`).join('|'), () => {
  syncFromStore()
})

function setStatus(taskId: string, status: TaskStatus) {
  workspace.updateTask(taskId, { status })
  // Re-sync lists after state change to keep cross-column drag stable.
  syncFromStore()
}

type WeekDay = { iso: string, label: string, weekday: string }

const weekDays = computed<WeekDay[]>(() => {
  const today = new Date()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const iso = d.toISOString().slice(0, 10)
    return {
      iso,
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  })
})

function tasksByDueDate(isoDate: string) {
  return workspace.tasks.filter(t => (t.due_date || '').slice(0, 10) === isoDate)
}

const { getColor } = useProjectColor()

function projectColor(projectId: string) {
  return getColor(projectId)
}

onMounted(async () => {
  await ensureSession()
  await workspace.fetchProjects()
  syncFromStore()
})
</script>
