<template>
  <Teleport to="body">
    <Transition name="member-modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Project members"
      >
        <button
          type="button"
          class="absolute inset-0 cursor-default bg-bg/80 backdrop-blur-sm"
          aria-label="Close members modal"
          @click="isOpen = false"
        />

        <section class="relative z-[101] w-full max-w-2xl overflow-hidden bg-surface shadow-2xl sketch-border">
          <header class="flex items-center justify-between border-b border-border/50 p-6">
            <h3 class="text-base font-semibold leading-6 text-text">
              Project Members
            </h3>
            <button
              type="button"
              class="btn btn-ghost btn-icon"
              aria-label="Close members modal"
              @click="isOpen = false"
            >
              x
            </button>
          </header>

          <div class="flex justify-end border-b border-border/50 px-6 py-4">
            <button
              type="button"
              class="btn btn-primary rounded-lg text-xs"
              @click="addRandomMember"
            >
              Add New Member
            </button>
          </div>

          <div class="custom-scrollbar grid max-h-[400px] grid-cols-2 gap-4 overflow-y-auto p-6">
            <div
              v-for="member in projectMembers"
              :key="member.id"
              class="group relative flex items-center gap-3 rounded-xl border border-border/50 bg-surface p-3 transition-all hover:border-brand/30 hover:bg-surface-elevated"
            >
              <img
                v-if="member.avatar_url"
                :src="member.avatar_url"
                :alt="member.name"
                class="h-10 w-10 rounded-full object-cover"
              >
              <div
                v-else
                class="flex h-10 w-10 items-center justify-center rounded-full bg-panel text-xs font-black text-brand"
                :aria-label="member.name"
              >
                {{ getInitials(member.name) }}
              </div>

              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-bold text-text">
                  {{ member.name }}
                </p>
                <p class="truncate text-xs text-muted">
                  {{ member.role }}
                </p>
              </div>

              <button
                class="absolute -right-1.5 -top-1.5 z-10 rounded-full bg-red p-1.5 text-white opacity-0 shadow-lg transition-all hover:scale-110 active:scale-95 group-hover:opacity-100"
                title="Unassign Member"
                type="button"
                @click="removeMember(member.id)"
              >
                <X class="h-3 w-3" />
              </button>
            </div>

            <div
              v-if="projectMembers.length === 0"
              class="col-span-2 py-8 text-center text-sm italic text-faint"
            >
              No members assigned to this production yet.
            </div>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { X } from 'lucide-vue-next'
import { useWorkspaceStore } from '~/stores/workspace'

const isOpen = defineModel<boolean>('open', { default: false })

const props = defineProps<{
  projectId: string
}>()

const workspace = useWorkspaceStore()

const project = computed(() => workspace.projects.find(p => p.id === props.projectId))
const projectMembers = computed(() => {
  if (!project.value?.member_ids) return []
  return workspace.members.filter(m => project.value?.member_ids?.includes(m.id))
})

function addRandomMember() {
  const unassigned = workspace.members.find(m => !project.value?.member_ids?.includes(m.id))
  if (unassigned && project.value) {
    if (!project.value.member_ids) project.value.member_ids = []
    project.value.member_ids.push(unassigned.id)
  }
}

function removeMember(memberId: string) {
  if (project.value && project.value.member_ids) {
    project.value.member_ids = project.value.member_ids.filter(id => id !== memberId)
  }
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('')
}
</script>

<style scoped>
.member-modal-enter-active,
.member-modal-leave-active {
  transition: opacity 0.2s ease;
}

.member-modal-enter-from,
.member-modal-leave-to {
  opacity: 0;
}
</style>
