<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <header class="flex items-end justify-between">
        <div>
          <h1 class="font-display text-2xl font-bold tracking-tight text-text">
            Production Hub
          </h1>
          <p class="mt-1 text-sm text-muted">
            Manage all active studio productions.
          </p>
        </div>
        <button
          class="btn btn-primary"
          @click="createProject = true"
        >
          <Plus class="h-4 w-4 mr-2" /> New Project
        </button>
      </header>

      <div
        v-if="createProject"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        role="dialog"
        aria-modal="true"
      >
        <div class="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-2xl">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="font-display text-lg font-bold text-text">
              Create New Project
            </h2>
            <button
              class="text-faint hover:text-text"
              aria-label="Close create project modal"
              @click="closeCreateModal"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <label class="mb-2 block text-xs font-semibold uppercase tracking-wider text-faint">Project Name</label>
          <input
            v-model="newProjectName"
            class="mb-4 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-text outline-none focus:border-brand"
            placeholder="e.g. Campaign Revamp"
            @keydown.enter.prevent="submitCreateProject"
          >

          <label class="mb-2 block text-xs font-semibold uppercase tracking-wider text-faint">Accent Color</label>
          <input
            v-model="newProjectColor"
            type="color"
            class="mb-5 h-10 w-20 cursor-pointer rounded border border-border bg-surface-elevated"
          >

          <p
            v-if="createError"
            class="mb-3 text-xs text-red-400"
          >
            {{ createError }}
          </p>

          <div class="flex justify-end gap-2">
            <button
              class="btn"
              @click="closeCreateModal"
            >
              Cancel
            </button>
            <button
              class="btn btn-primary"
              @click="submitCreateProject"
            >
              Create Project
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProjectCard
          v-for="project in workspace.activeProjects"
          :key="project.id"
          :project="project"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, X } from 'lucide-vue-next'
import { useWorkspaceStore } from '~/stores/workspace'
import { useWorkspaceBoot } from '~/composables/useWorkspaceBoot'

const workspace = useWorkspaceStore()
const { ensureSession } = useWorkspaceBoot()
const createProject = ref(false)
const newProjectName = ref('')
const newProjectColor = ref('#6A5AF9')
const createError = ref('')

function closeCreateModal() {
  createProject.value = false
  createError.value = ''
}

async function submitCreateProject() {
  if (!newProjectName.value.trim()) {
    createError.value = 'Project name is required.'
    return
  }

  const created = await workspace.createProject({
    name: newProjectName.value,
    color_code: newProjectColor.value
  })

  if (!created) {
    createError.value = 'Failed to create project.'
    return
  }

  closeCreateModal()
  newProjectName.value = ''
  await navigateTo(`/projects/${created.id}`)
}

onMounted(async () => {
  await ensureSession()
})
</script>
