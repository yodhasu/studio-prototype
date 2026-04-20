<template>
  <div 
    class="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-surface/50 hover:bg-surface hover:border-brand/30 transition-all cursor-pointer group"
    @click="isModalOpen = true"
  >
    <div class="flex flex-col">
      <span class="text-xs font-bold text-muted uppercase tracking-wider">Assigned Members</span>
      <div class="mt-2 flex -space-x-2 overflow-hidden">
        <UAvatar 
          v-for="member in projectMembers" 
          :key="member.id"
          :src="member.avatar_url" 
          :alt="member.name" 
          size="sm"
          class="ring-2 ring-surface bg-brand/10 text-brand font-bold"
        />
        <div v-if="projectMembers.length === 0" class="text-sm italic text-faint">No members assigned</div>
      </div>
    </div>
    <ChevronRight class="w-5 h-5 text-faint group-hover:text-brand group-hover:translate-x-1 transition-all" />

    <ProjectMemberModal v-model="isModalOpen" :project-id="projectId" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { useWorkspaceStore } from '~/stores/workspace'

const props = defineProps<{
  projectId: string
}>()

const workspace = useWorkspaceStore()
const isModalOpen = ref(false)

const project = computed(() => workspace.projects.find(p => p.id === props.projectId))
const projectMembers = computed(() => {
  if (!project.value?.member_ids) return []
  return workspace.members.filter(m => project.value?.member_ids?.includes(m.id))
})
</script>
