<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <header class="flex items-end justify-between">
        <div>
          <h1 class="font-display text-2xl font-bold tracking-tight text-text">
            Notes
          </h1>
          <p class="mt-1 text-sm text-muted">
            Capture ideas and project context.
          </p>
        </div>
      </header>

      <section class="dashboard-panel">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            v-model="newTitle"
            class="input-base sketch-border"
            placeholder="Title"
          >
          <select
            v-model="newProjectId"
            class="input-base sketch-border"
          >
            <option value="">
              (Workspace note)
            </option>
            <option
              v-for="p in workspace.activeProjects"
              :key="p.id"
              :value="p.id"
            >
              {{ p.name }}
            </option>
          </select>
          <button
            class="btn btn-primary"
            type="button"
            @click="createNote"
          >
            Add note
          </button>
        </div>

        <textarea
          v-model="newBody"
          class="input-base sketch-border mt-3 min-h-28 resize-y"
          placeholder="Write context..."
        />
      </section>

      <section class="dashboard-panel">
        <div class="flex items-center justify-between">
          <h2 class="font-display text-lg font-bold text-text">
            All notes
          </h2>
          <span class="text-[10px] font-mono text-muted">{{ workspace.activeNotes.length }}</span>
        </div>

        <div class="mt-6 space-y-3">
          <div
            v-for="n in workspace.activeNotes"
            :key="n.id"
            class="rounded-xl border border-border bg-panel/20 p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-sm font-bold text-text">
                  {{ n.title }}
                </p>
                <p class="mt-1 text-[10px] text-muted">
                  {{ n.project_id ? projectName(n.project_id) : 'Workspace' }}
                  • {{ n.created_at.slice(0, 10) }}
                </p>
              </div>
            </div>
            <p class="mt-3 text-xs text-muted whitespace-pre-wrap">
              {{ n.body }}
            </p>
          </div>

          <p
            v-if="workspace.activeNotes.length === 0"
            class="text-sm italic text-faint"
          >
            No notes yet.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useWorkspaceStore } from '~/stores/workspace'
import { useWorkspaceBoot } from '~/composables/useWorkspaceBoot'

const workspace = useWorkspaceStore()
const { ensureSession } = useWorkspaceBoot()

const newTitle = ref('')
const newBody = ref('')
const newProjectId = ref('')

function projectName(projectId: string) {
  return workspace.getProjectById(projectId)?.name || 'Project'
}

function createNote() {
  const title = newTitle.value.trim()
  const body = newBody.value.trim()
  if (!title || !body) return
  workspace.createNote({
    title,
    body,
    project_id: newProjectId.value || undefined
  })
  newTitle.value = ''
  newBody.value = ''
  newProjectId.value = ''
}

onMounted(async () => {
  await ensureSession()
})
</script>
