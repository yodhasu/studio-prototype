<template>
  <div class="space-y-4">
    <div
      v-if="projectMembers.length === 0"
      class="text-sm italic text-faint py-8 text-center"
    >
      No members assigned to this workspace yet.
    </div>
    <div
      v-else
      class="grid gap-3"
    >
      <div
        v-for="member in projectMembers"
        :key="member.id"
        class="flex items-center gap-3 p-3 sketch-border bg-[var(--c-bg)]/40 border-border/20"
      >
        <img
          v-if="member.avatar_url"
          :src="member.avatar_url"
          :alt="member.name"
          class="h-8 w-8 rounded-full object-cover ring-2 ring-surface sketch-border"
        >
        <div
          v-else
          class="flex h-8 w-8 items-center justify-center rounded-full bg-panel text-[10px] font-black text-brand ring-2 ring-surface sketch-border"
          :aria-label="member.name"
        >
          {{ getInitials(member.name) }}
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-bold text-text">{{ member.name }}</span>
          <span class="text-[10px] text-faint uppercase font-bold tracking-tight">{{ member.role || 'Member' }}</span>
        </div>
        <div class="ml-auto">
          <span
            class="h-2 w-2 rounded-full bg-green-500 block"
            title="Online"
          />
        </div>
      </div>
    </div>

    <div class="mt-6 pt-6 border-t border-border/10">
      <button
        type="button"
        class="btn btn-ghost w-full text-[10px] font-bold uppercase tracking-widest"
      >
        Add Member
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWorkspaceStore } from '~/stores/workspace'

const props = defineProps<{
  projectId: string
}>()

const workspace = useWorkspaceStore()

const project = computed(() => workspace.projects.find(p => p.id === props.projectId))
const projectMembers = computed(() => {
  if (!project.value?.member_ids) return []
  return workspace.members.filter(m => project.value?.member_ids?.includes(m.id))
})

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('')
}
</script>
