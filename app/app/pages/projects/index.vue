<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <header class="flex items-end justify-between">
        <div>
          <h1 class="font-display text-2xl font-bold tracking-tight text-text">Production Hub</h1>
          <p class="mt-1 text-sm text-muted">Manage all active studio productions.</p>
        </div>
        <button class="btn btn-primary">
          <Plus class="h-4 w-4 mr-2" /> New Project
        </button>
      </header>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <NuxtLink 
          v-for="project in workspace.projects" 
          :key="project.id" 
          :to="`/projects/${project.id}`"
          class="project-card group"
        >
          <div class="flex items-start justify-between">
            <div class="h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg" :style="{ backgroundColor: project.color_code + '20', color: project.color_code }">
              {{ project.name[0] }}
            </div>
            <span class="badge" :style="{ borderColor: project.color_code + '40', color: project.color_code }">{{ project.status }}</span>
          </div>
          <h3 class="mt-6 font-display text-lg font-bold text-text group-hover:text-brand transition-colors">{{ project.name }}</h3>
          <p class="mt-2 text-sm text-muted line-clamp-2 italic">Standard production environment for {{ project.name.toLowerCase() }}.</p>
          
          <div class="mt-8 flex items-center justify-between border-t border-border/50 pt-4">
            <div class="flex items-center gap-4 text-[11px] font-bold text-faint">
              <span class="flex items-center gap-1.5"><FolderKanban class="h-3.5 w-3.5" /> {{ project.card_count }}</span>
              <span class="flex items-center gap-1.5"><CalendarDays class="h-3.5 w-3.5" /> {{ project.task_count }}</span>
            </div>
            <ArrowRight class="h-4 w-4 text-faint group-hover:translate-x-1 group-hover:text-brand transition-all" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, FolderKanban, CalendarDays, ArrowRight } from 'lucide-vue-next'
import { useWorkspaceStore } from '~/stores/workspace'
import { useWorkspaceBoot } from '~/composables/useWorkspaceBoot'

const workspace = useWorkspaceStore()
const { ensureSession } = useWorkspaceBoot()

onMounted(async () => {
  await ensureSession()
})
</script>
