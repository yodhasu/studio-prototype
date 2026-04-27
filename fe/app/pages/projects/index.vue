<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <BaseSectionHeader
        title="Production Hub"
        description="Manage all active studio productions."
      >
        <template #action>
          <BaseButton variant="primary" @click="createProject = true">
            <Plus class="h-4 w-4 mr-2" /> New Project
          </BaseButton>
        </template>
      </BaseSectionHeader>

      <BaseModal
        v-model:open="createProject"
        title="Create New Project"
        max-width="md"
      >
        <div class="p-6">
          <label class="mb-2 block text-xs font-semibold uppercase tracking-wider text-faint">Project Name</label>
          <input
            v-model="newProjectName"
            class="input-base mb-4 sketch-border"
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
            class="mb-3 text-xs text-red"
          >
            {{ createError }}
          </p>

          <div class="flex justify-end gap-2 mt-4">
            <BaseButton variant="ghost" @click="closeCreateModal">
              Cancel
            </BaseButton>
            <BaseButton variant="primary" @click="submitCreateProject">
              Create Project
            </BaseButton>
          </div>
        </div>
      </BaseModal>

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
import { ref, onMounted } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import BaseSectionHeader from '~/components/base/BaseSectionHeader.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseModal from '~/components/base/BaseModal.vue'
import ProjectCard from '~/components/ProjectCard.vue'
import { useWorkspaceStore } from '~/stores/workspace'
import { useWorkspaceBoot } from '~/composables/useWorkspaceBoot'

const router = useRouter()
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
  await router.push(`/projects/${created.id}`)
}

onMounted(async () => {
  await ensureSession()
})
</script>
