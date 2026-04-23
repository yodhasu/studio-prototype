<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <div
        v-if="!project"
        class="sketch-border bg-surface p-6"
      >
        <p class="text-[10px] font-black uppercase tracking-widest text-faint">
          Project Not Found
        </p>
        <p class="mt-2 text-sm text-muted">
          The requested command sheet does not exist.
        </p>
        <NuxtLink
          class="btn btn-primary mt-4 inline-flex"
          to="/projects"
        >Back to Projects</NuxtLink>
      </div>

      <template v-else>
        <header class="sketch-border bg-surface p-6">
          <div class="flex items-center justify-between gap-4">
            <div class="min-w-0">
              <p class="text-[10px] font-black uppercase tracking-widest text-faint">
                Production / Projects
              </p>
              <div class="mt-2 flex items-center gap-3">
                <div
                  class="h-3 w-3 rounded-full"
                  :style="{ backgroundColor: project.color_code || 'rgb(var(--c-border))' }"
                />
                <h1 class="truncate font-display text-2xl font-black tracking-tight text-text">
                  {{ project.name }}
                </h1>
              </div>
              <p class="mt-2 text-sm text-muted">
                {{ project.description || 'Project command sheet.' }}
              </p>
            </div>

            <div class="shrink-0 flex items-center gap-2">
              <span
                class="badge"
                :style="project.color_code ? { borderColor: project.color_code + '40', color: project.color_code } : undefined"
              >{{ project.status }}</span>
              <button
                class="btn"
                type="button"
                @click="openEdit"
              >
                Edit
              </button>
              <NuxtLink
                class="btn btn-primary"
                :to="`/workspace/${project.id}`"
              >Enter Workspace</NuxtLink>
            </div>
          </div>

          <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div class="rounded-xl border border-border bg-panel/20 p-3">
              <p class="text-[10px] font-black uppercase tracking-widest text-faint">
                Milestones
              </p>
              <p class="mt-2 font-display text-lg font-black text-text">
                {{ milestoneCount }}
              </p>
            </div>
            <div class="rounded-xl border border-border bg-panel/20 p-3">
              <p class="text-[10px] font-black uppercase tracking-widest text-faint">
                Tasks
              </p>
              <p class="mt-2 font-display text-lg font-black text-text">
                {{ taskCount }}
              </p>
            </div>
            <div class="rounded-xl border border-border bg-panel/20 p-3">
              <p class="text-[10px] font-black uppercase tracking-widest text-faint">
                Stage
              </p>
              <p class="mt-2 text-xs font-black text-text">
                {{ stageLabel }}
              </p>
            </div>
            <div class="rounded-xl border border-border bg-panel/20 p-3">
              <p class="text-[10px] font-black uppercase tracking-widest text-faint">
                Next due
              </p>
              <p class="mt-2 text-xs font-black text-text">
                {{ nextDueLabel }}
              </p>
            </div>
          </div>
        </header>

        <div class="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <section class="dashboard-panel flex h-full min-h-0 flex-col xl:col-span-7">
            <div class="flex items-center justify-between">
              <h2 class="font-display text-lg font-black text-text">
                Deliverables
              </h2>
              <NuxtLink
                class="text-xs font-black text-brand hover:underline"
                to="/schedule"
              >Open Schedule</NuxtLink>
            </div>
            <div class="mt-6 flex-1 min-h-0">
              <ProjectTaskList :project-id="project.id" />
            </div>
          </section>

          <aside class="space-y-6 xl:col-span-5">
            <section class="dashboard-panel">
              <h2 class="font-display text-lg font-black text-text">
                Collaborators
              </h2>
              <p class="mt-1 text-xs text-muted">
                Mock roster from store activity.
              </p>
              <div class="mt-5">
                <ProjectMemberBox :project-id="project.id" />
              </div>
            </section>

            <section class="dashboard-panel">
              <h2 class="font-display text-lg font-black text-text">
                Milestones
              </h2>
              <div class="mt-5 space-y-2">
                <div
                  v-for="m in projectMilestones"
                  :key="m.id"
                  class="flex items-center justify-between rounded-lg border border-border bg-panel/20 p-3"
                >
                  <div class="min-w-0">
                    <p class="truncate text-sm font-bold text-text">
                      {{ m.title }}
                    </p>
                    <p class="mt-1 text-[10px] text-muted">
                      Due {{ m.due_date || 'TBD' }} • {{ m.status }}
                    </p>
                  </div>
                  <button
                    class="btn btn-ghost text-[10px] font-black uppercase tracking-widest"
                    type="button"
                    @click="toggleMilestone(m.id)"
                  >
                    {{ m.status === 'DONE' ? 'Reopen' : 'Done' }}
                  </button>
                </div>

                <p
                  v-if="projectMilestones.length === 0"
                  class="text-sm text-faint italic"
                >
                  No milestones yet.
                </p>
              </div>

              <div class="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <input
                  v-model="newMilestoneTitle"
                  class="input-base sketch-border sm:col-span-2"
                  placeholder="New milestone title"
                >
                <input
                  v-model="newMilestoneDue"
                  type="date"
                  class="input-base sketch-border"
                >
                <button
                  class="btn btn-primary sm:col-span-3"
                  type="button"
                  @click="addMilestone"
                >
                  Add milestone
                </button>
              </div>
            </section>

            <section class="dashboard-panel">
              <h2 class="font-display text-lg font-black text-text">
                Notes
              </h2>

              <div class="mt-5 space-y-2">
                <div
                  v-for="n in projectNotes"
                  :key="n.id"
                  class="rounded-lg border border-border bg-panel/20 p-3"
                >
                  <p class="text-sm font-bold text-text">
                    {{ n.title }}
                  </p>
                  <p class="mt-2 text-xs text-muted whitespace-pre-wrap">
                    {{ n.body }}
                  </p>
                </div>

                <p
                  v-if="projectNotes.length === 0"
                  class="text-sm text-faint italic"
                >
                  No notes yet.
                </p>
              </div>

              <div class="mt-5 space-y-2">
                <input
                  v-model="newNoteTitle"
                  class="input-base sketch-border"
                  placeholder="Note title"
                >
                <textarea
                  v-model="newNoteBody"
                  class="input-base sketch-border min-h-24 resize-y"
                  placeholder="Write context..."
                />
                <button
                  class="btn btn-primary"
                  type="button"
                  @click="addNote"
                >
                  Add note
                </button>
              </div>
            </section>

            <section class="dashboard-panel">
              <h2 class="font-display text-lg font-black text-text">
                Activity
              </h2>
              <div
                v-if="projectActivities.length"
                class="mt-5 space-y-4"
              >
                <div
                  v-for="a in projectActivities.slice(0, 6)"
                  :key="a.id"
                  class="rounded-lg border border-border bg-panel/20 p-3"
                >
                  <p class="text-[10px] font-black uppercase tracking-widest text-faint">
                    {{ a.type }}
                  </p>
                  <p class="mt-2 text-sm text-text">
                    {{ a.message }}
                  </p>
                  <p class="mt-2 text-[10px] text-muted italic">
                    by {{ actorName(a.actor_user_id) }}
                  </p>
                </div>
              </div>
              <p
                v-else
                class="mt-5 text-sm text-muted italic"
              >
                No activity recorded.
              </p>
            </section>

            <section class="dashboard-panel">
              <h2 class="font-display text-lg font-black text-text">
                Workspace Launch
              </h2>
              <p class="mt-1 text-xs text-muted">
                Enter the concept graph with project context preserved.
              </p>
              <NuxtLink
                class="btn btn-primary mt-5 inline-flex w-full justify-center"
                :to="`/workspace/${project.id}`"
              >
                Enter Workspace
              </NuxtLink>
            </section>
          </aside>
        </div>
      </template>
    </div>

    <div
      v-if="editOpen && project"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div class="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-2xl">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="font-display text-lg font-bold text-text">
            Edit Project
          </h2>
          <button
            class="text-faint hover:text-text"
            aria-label="Close edit project modal"
            @click="editOpen = false"
          >
            ✕
          </button>
        </div>

        <label class="mb-2 block text-xs font-semibold uppercase tracking-wider text-faint">Name</label>
        <input
          v-model="editName"
          class="mb-4 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-text outline-none focus:border-brand"
        >

        <label class="mb-2 block text-xs font-semibold uppercase tracking-wider text-faint">Description</label>
        <textarea
          v-model="editDescription"
          class="input-base sketch-border mb-4 min-h-24 resize-y"
        />

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label class="block">
            <span class="mb-2 block text-xs font-semibold uppercase tracking-wider text-faint">Status</span>
            <select
              v-model="editStatus"
              class="input-base sketch-border"
            >
              <option value="PLANNING">PLANNING</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="PAUSED">PAUSED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </label>

          <label class="block">
            <span class="mb-2 block text-xs font-semibold uppercase tracking-wider text-faint">Color</span>
            <input
              v-model="editColor"
              type="color"
              class="h-10 w-20 cursor-pointer rounded border border-border bg-surface-elevated"
            >
          </label>
        </div>

        <div class="mt-5 flex justify-end gap-2">
          <button
            class="btn"
            type="button"
            @click="editOpen = false"
          >
            Cancel
          </button>
          <button
            class="btn btn-primary"
            type="button"
            @click="saveEdit"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useWorkspaceStore, type ProjectStatus } from '~/stores/workspace'
import { useWorkspaceBoot } from '~/composables/useWorkspaceBoot'

const workspace = useWorkspaceStore()
const { ensureSession } = useWorkspaceBoot()

const route = useRoute()
const projectId = computed(() => route.params.projectId as string)

const project = computed(() => workspace.projects.find(p => p.id === projectId.value) || null)

const editOpen = ref(false)
const editName = ref('')
const editDescription = ref('')
const editStatus = ref<ProjectStatus>('PLANNING')
const editColor = ref('#6A5AF9')

function openEdit() {
  if (!project.value) return
  editName.value = project.value.name
  editDescription.value = project.value.description || ''
  editStatus.value = project.value.status
  editColor.value = project.value.color_code || '#6A5AF9'
  editOpen.value = true
}

function saveEdit() {
  if (!project.value) return
  const name = editName.value.trim()
  if (!name) return

  workspace.updateProject(project.value.id, {
    name,
    description: editDescription.value.trim() || undefined,
    status: editStatus.value,
    color_code: editColor.value
  })

  editOpen.value = false
}

const taskCount = computed(() => workspace.tasks.filter(t => t.project_id === projectId.value).length)
const milestoneCount = computed(() => workspace.milestones.filter(m => m.project_id === projectId.value).length)

function actorName(userId: string) {
  return workspace.getUserById(userId)?.name || 'User'
}

const projectMilestones = computed(() => workspace.milestones.filter(m => m.project_id === projectId.value))
const projectNotes = computed(() => workspace.notes.filter(n => n.project_id === projectId.value))

const newMilestoneTitle = ref('')
const newMilestoneDue = ref('')

function addMilestone() {
  const title = newMilestoneTitle.value.trim()
  if (!title) return
  workspace.createMilestone({
    project_id: projectId.value,
    title,
    due_date: newMilestoneDue.value || undefined
  })
  newMilestoneTitle.value = ''
  newMilestoneDue.value = ''
}

function toggleMilestone(milestoneId: string) {
  const m = workspace.milestones.find(x => x.id === milestoneId)
  if (!m) return
  workspace.updateMilestone(milestoneId, { status: m.status === 'DONE' ? 'OPEN' : 'DONE' })
}

const newNoteTitle = ref('')
const newNoteBody = ref('')

function addNote() {
  const title = newNoteTitle.value.trim()
  const body = newNoteBody.value.trim()
  if (!title || !body) return
  workspace.createNote({ title, body, project_id: projectId.value })
  newNoteTitle.value = ''
  newNoteBody.value = ''
}

const projectActivities = computed(() => {
  const p = project.value
  if (!p) return []
  return workspace.activities.filter(a => a.project_id === p.id)
})

const stageLabel = computed(() => {
  const total = workspace.tasks.filter(t => t.project_id === projectId.value).length
  const done = workspace.tasks.filter(t => t.project_id === projectId.value && t.status === 'COMPLETED').length
  if (!total) return 'Draft'
  const ratio = done / total
  if (ratio >= 1) return 'Final'
  if (ratio >= 0.7) return 'Polish'
  if (ratio >= 0.3) return 'Review'
  return 'Draft'
})

const nextDueLabel = computed(() => {
  const dues = workspace.tasks
    .filter(t => t.project_id === projectId.value)
    .map(t => t.due_date)
    .filter((d): d is string => Boolean(d))
    .map(d => new Date(d).getTime())
    .filter(ms => Number.isFinite(ms))
    .sort((a, b) => a - b)

  const next = dues[0]
  if (!next) return 'None'
  return new Date(next).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})

onMounted(async () => {
  await ensureSession()
  const p = project.value
  if (p) workspace.setCurrentProject(p.id)
})
</script>
