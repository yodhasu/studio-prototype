<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <header class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 class="font-display text-2xl font-bold tracking-tight text-text">
            Schedule
          </h1>
          <p class="mt-1 text-sm text-muted">
            Kanban for production flow, calendar for date-bound visibility.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <div class="flex items-center gap-2 sketch-border bg-surface p-1">
            <button
              class="px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg"
              :class="mode === 'list' ? 'bg-panel/40 text-text' : 'text-faint hover:text-muted'"
              @click="mode = 'list'"
            >
              List
            </button>
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

          <div class="sketch-border bg-surface p-2">
            <label class="block text-[9px] font-black uppercase tracking-widest text-faint">Member</label>
            <select
              v-model="memberFilter"
              class="mt-1 rounded-lg border border-border bg-surface-elevated px-3 py-2 text-xs text-text outline-none focus:border-brand"
            >
              <option value="">
                All
              </option>
              <option
                v-for="m in workspace.members"
                :key="m.id"
                :value="m.id"
              >
                {{ m.name }}
              </option>
            </select>
          </div>
        </div>
      </header>

      <!-- List view -->
      <section
        v-if="mode === 'list'"
        class="dashboard-panel"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-xs font-bold uppercase tracking-widest text-muted">
            Tasks
          </h2>
          <span class="text-[10px] font-mono text-muted">{{ tasksSorted.length }}</span>
        </div>

        <div class="mt-6 space-y-2">
          <NuxtLink
            v-for="t in tasksSorted"
            :key="t.id"
            class="flex items-center justify-between rounded-lg border border-border bg-surface/60 p-3 hover:border-brand/30 transition-colors"
            :to="`/projects/${t.project_id}`"
          >
            <div class="min-w-0">
              <p class="truncate text-xs font-bold text-text">{{ t.title }}</p>
              <p class="truncate text-[10px] text-muted">
                {{ projectName(t.project_id) }}
                • {{ t.status }}
                • {{ t.assignee_id ? assigneeName(t.assignee_id) : 'Unassigned' }}
              </p>
            </div>
            <span
              class="text-[10px] font-mono"
              :class="isOverdue(t) ? 'text-red' : 'text-faint'"
            >{{ t.due_date || 'TBD' }}</span>
          </NuxtLink>

          <p
            v-if="tasksSorted.length === 0"
            class="text-sm text-faint italic"
          >
            No tasks match the current filter.
          </p>
        </div>
      </section>

      <!-- Kanban view -->
      <section
        v-else-if="mode === 'kanban'"
        class="space-y-6"
      >
        <div class="grid grid-cols-1 gap-6 xl:grid-cols-4">
          <KanbanColumn
            v-model="draftList"
            title="Planning"
            subtitle="PLANNING"
            @moved="(id) => setStatus(id, 'PLANNING')"
            @open="openTask"
          />
          <KanbanColumn
            v-model="reviewList"
            title="Active"
            subtitle="ACTIVE"
            @moved="(id) => setStatus(id, 'ACTIVE')"
            @open="openTask"
          />
          <KanbanColumn
            v-model="polishList"
            title="Paused"
            subtitle="PAUSED"
            @moved="(id) => setStatus(id, 'PAUSED')"
            @open="openTask"
          />
          <KanbanColumn
            v-model="finalList"
            title="Completed"
            subtitle="COMPLETED"
            @moved="(id) => setStatus(id, 'COMPLETED')"
            @open="openTask"
          />
        </div>

        <p class="text-xs text-faint italic">
          Drag between columns updates task status.
        </p>
      </section>

      <!-- Calendar view (month grid) -->
      <section
        v-else
        class="space-y-6"
      >
        <div class="dashboard-panel">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-xs font-bold uppercase tracking-widest text-muted">
                Calendar
              </h2>
              <p class="mt-2 font-display text-lg font-bold text-text">
                {{ monthLabel }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="btn btn-ghost"
                type="button"
                @click="prevMonth"
              >
                Prev
              </button>
              <button
                class="btn"
                type="button"
                @click="goToday"
              >
                Today
              </button>
              <button
                class="btn btn-ghost"
                type="button"
                @click="nextMonth"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <aside class="dashboard-panel xl:col-span-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-faint">
              Selected day
            </p>
            <p class="mt-2 text-sm font-bold text-text">
              {{ selectedDayLabel }}
            </p>

            <div class="mt-5 grid grid-cols-7 gap-1">
              <div
                v-for="w in weekdayLabels"
                :key="w"
                class="text-center text-[9px] font-black uppercase tracking-widest text-faint"
              >
                {{ w }}
              </div>

              <button
                v-for="d in monthDays"
                :key="'mini-' + d.iso"
                type="button"
                class="rounded-md border border-border/40 bg-surface/50 px-0 py-2 text-center text-[10px] font-mono transition-colors hover:border-brand/30"
                :class="{
                  'opacity-40': !d.inMonth,
                  'border-brand/40 bg-brand/10 text-brand': d.iso === selectedDayIso,
                  'ring-1 ring-brand/30': d.isToday
                }"
                @click="selectedDayIso = d.iso"
              >
                {{ d.day }}
              </button>
            </div>

            <div class="mt-6">
              <p class="text-[10px] font-black uppercase tracking-widest text-faint">
                Day items
              </p>
              <div class="mt-3 space-y-2">
                <button
                  v-for="t in tasksByDueDate(selectedDayIso)"
                  :key="t.id"
                  type="button"
                  class="w-full rounded-lg border border-border bg-panel/20 p-3 text-left hover:border-brand/30"
                  @click="openTask(t)"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div class="min-w-0">
                      <p class="truncate text-xs font-bold text-text">
                        {{ t.title }}
                      </p>
                      <p class="truncate text-[10px] text-muted">
                        {{ projectName(t.project_id) }} • {{ t.status }}
                      </p>
                    </div>
                    <span
                      class="h-2 w-2 shrink-0 rounded-full"
                      :style="{ backgroundColor: projectColor(t.project_id) }"
                    />
                  </div>
                </button>

                <p
                  v-if="tasksByDueDate(selectedDayIso).length === 0"
                  class="text-sm italic text-faint"
                >
                  No date-bound items.
                </p>
              </div>
            </div>
          </aside>

          <div class="dashboard-panel xl:col-span-9">
            <div class="grid grid-cols-7 gap-2">
              <div
                v-for="w in weekdayLabels"
                :key="'header-' + w"
                class="text-center text-[10px] font-black uppercase tracking-widest text-faint"
              >
                {{ w }}
              </div>
            </div>

            <div class="mt-3 grid grid-cols-7 gap-2">
              <button
                v-for="d in monthDays"
                :key="d.iso"
                type="button"
                class="relative min-h-[110px] rounded-xl border border-border bg-surface/40 p-2 text-left transition-colors hover:border-brand/30"
                :class="{
                  'opacity-50': !d.inMonth,
                  'border-brand/40 bg-brand/10': d.iso === selectedDayIso,
                  'ring-1 ring-brand/30': d.isToday
                }"
                @click="selectedDayIso = d.iso"
              >
                <div class="flex items-center justify-between">
                  <p class="text-[10px] font-mono text-muted">
                    {{ d.day }}
                  </p>
                  <span
                    v-if="tasksByDueDate(d.iso).length"
                    class="text-[9px] font-black uppercase tracking-widest text-faint"
                  >
                    {{ tasksByDueDate(d.iso).length }}
                  </span>
                </div>

                <div class="mt-2 space-y-1">
                  <button
                    v-for="t in tasksByDueDate(d.iso).slice(0, 3)"
                    :key="t.id"
                    type="button"
                    class="flex w-full items-center gap-2 rounded-md border border-border/40 bg-panel/20 px-2 py-1 text-left text-[10px] text-text hover:border-brand/30"
                    @click.stop="openTask(t)"
                  >
                    <span
                      class="h-2 w-2 shrink-0 rounded-full"
                      :style="{ backgroundColor: projectColor(t.project_id) }"
                    />
                    <span class="truncate">{{ t.title }}</span>
                  </button>

                  <p
                    v-if="tasksByDueDate(d.iso).length > 3"
                    class="text-[10px] text-faint"
                  >
                    +{{ tasksByDueDate(d.iso).length - 3 }} more
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <TaskModal
      v-model:open="taskModalOpen"
      :task="selectedTask"
      :project-id="selectedTask?.project_id || ''"
      :initial-mode="'detail'"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useWorkspaceStore, type Task, type TaskStatus } from '~/stores/workspace'
import { useWorkspaceBoot } from '~/composables/useWorkspaceBoot'
import { useProjectColor } from '~/composables/useProjectColor'

const workspace = useWorkspaceStore()
const { ensureSession } = useWorkspaceBoot()

const mode = ref<'list' | 'kanban' | 'calendar'>('list')
const memberFilter = ref('')

const draftList = ref<Task[]>([])
const reviewList = ref<Task[]>([])
const polishList = ref<Task[]>([])
const finalList = ref<Task[]>([])

const taskModalOpen = ref(false)
const selectedTask = ref<Task | null>(null)

function openTask(task: Task) {
  selectedTask.value = task
  taskModalOpen.value = true
}

function syncFromStore() {
  const base = memberFilter.value
    ? workspace.activeTasks.filter(t => t.assignee_id === memberFilter.value)
    : workspace.activeTasks

  draftList.value = base.filter(t => t.status === 'PLANNING')
  reviewList.value = base.filter(t => t.status === 'ACTIVE')
  polishList.value = base.filter(t => t.status === 'PAUSED')
  finalList.value = base.filter(t => t.status === 'COMPLETED')
}

watch(
  () => [
    workspace.activeTasks.map(t => `${t.id}:${t.status}:${t.assignee_id ?? ''}:${t.due_date ?? ''}`).join('|'),
    memberFilter.value
  ].join('::'),
  () => {
    syncFromStore()
  }
)

function setStatus(taskId: string, status: TaskStatus) {
  workspace.updateTask(taskId, { status })
  // Re-sync lists after state change to keep cross-column drag stable.
  syncFromStore()
}

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

type CalendarDay = { iso: string, day: number, inMonth: boolean, isToday: boolean }

const calendarMonth = ref(startOfMonth(new Date()))
const selectedDayIso = ref(localIso(new Date()))

const monthLabel = computed(() => {
  return calendarMonth.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const monthDays = computed<CalendarDay[]>(() => {
  const first = startOfMonth(calendarMonth.value)
  const offset = (first.getDay() + 6) % 7 // Monday-start
  const start = new Date(first)
  start.setDate(first.getDate() - offset)

  const todayIso = localIso(new Date())

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const iso = localIso(d)

    return {
      iso,
      day: d.getDate(),
      inMonth: d.getMonth() === first.getMonth(),
      isToday: iso === todayIso
    }
  })
})

const selectedDayLabel = computed(() => {
  const d = parseIsoDate(selectedDayIso.value)
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
})

function prevMonth() {
  const d = new Date(calendarMonth.value)
  d.setMonth(d.getMonth() - 1, 1)
  calendarMonth.value = startOfMonth(d)
}

function nextMonth() {
  const d = new Date(calendarMonth.value)
  d.setMonth(d.getMonth() + 1, 1)
  calendarMonth.value = startOfMonth(d)
}

function goToday() {
  const t = new Date()
  calendarMonth.value = startOfMonth(t)
  selectedDayIso.value = localIso(t)
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function localIso(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function parseIsoDate(iso: string) {
  const parts = iso.split('-').map(Number)
  const now = new Date()
  const y = Number.isFinite(parts[0]) ? parts[0]! : now.getFullYear()
  const m = Number.isFinite(parts[1]) ? parts[1]! : now.getMonth() + 1
  const d = Number.isFinite(parts[2]) ? parts[2]! : 1
  return new Date(y, m - 1, d)
}

function tasksByDueDate(isoDate: string) {
  const base = memberFilter.value
    ? workspace.activeTasks.filter(t => t.assignee_id === memberFilter.value)
    : workspace.activeTasks

  return base.filter(t => (t.due_date || '').slice(0, 10) === isoDate)
}

function projectName(projectId: string) {
  return workspace.getProjectById(projectId)?.name || 'Project'
}

function assigneeName(userId: string) {
  return workspace.getUserById(userId)?.name || 'Member'
}

function isOverdue(t: Task) {
  if (!t.due_date) return false
  if (t.status === 'COMPLETED') return false
  const ms = new Date(t.due_date).getTime()
  if (!Number.isFinite(ms)) return false

  const todayIso = new Date().toISOString().slice(0, 10)
  return t.due_date.slice(0, 10) < todayIso
}

const tasksSorted = computed(() => {
  const base = memberFilter.value
    ? workspace.activeTasks.filter(t => t.assignee_id === memberFilter.value)
    : workspace.activeTasks

  const scoreStatus = (s: TaskStatus) => ({ PLANNING: 0, ACTIVE: 1, PAUSED: 2, COMPLETED: 3 }[s] ?? 9)

  return [...base].sort((a, b) => {
    const ad = (a.due_date || '').slice(0, 10)
    const bd = (b.due_date || '').slice(0, 10)

    if (ad && !bd) return -1
    if (!ad && bd) return 1
    if (ad && bd && ad !== bd) return ad < bd ? -1 : 1

    const as = scoreStatus(a.status)
    const bs = scoreStatus(b.status)
    if (as !== bs) return as - bs

    return a.title.localeCompare(b.title)
  })
})

const { getColor } = useProjectColor()

function projectColor(projectId: string) {
  return getColor(projectId)
}

onMounted(async () => {
  await ensureSession()
  syncFromStore()
})
</script>
