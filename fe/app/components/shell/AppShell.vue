<template>
  <div
    class="flex min-h-screen bg-[var(--c-bg)] text-text selection:bg-brand/20"
    :style="shellStyle"
  >
    <aside class="hidden w-[272px] shrink-0 flex-col border-r border-border bg-surface-elevated/60 backdrop-blur-xl lg:flex">
      <div class="p-6">
        <NuxtLink
          to="/dashboard"
          class="flex items-center gap-3"
        >
          <div class="h-9 w-9 rounded-xl border border-border bg-panel/40 p-2 text-brand">
            <AppLogo class="h-full w-full" />
          </div>
          <div class="min-w-0">
            <p class="truncate text-[11px] font-black uppercase tracking-[0.18em] text-text">Studio Prototype</p>
            <p class="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-faint">Ivory Forge Shell</p>
          </div>
        </NuxtLink>
      </div>

      <nav class="flex-1 px-4 pb-6">
        <p class="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-faint/70">
          Production
        </p>
        <div class="mt-3 space-y-1">
          <NuxtLink
            v-for="item in primaryNav"
            :key="item.to"
            :to="item.to"
            class="nav-item group"
            :class="{ active: isActive(item.to) }"
          >
            <component
              :is="item.icon"
              class="h-4 w-4 transition-transform group-hover:scale-110"
            />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </div>

        <div
          v-if="activeProject"
          class="mt-8"
        >
          <p class="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-faint/70">
            Active Project
          </p>
          <div class="mt-3 rounded-[var(--r-lg)] border border-border bg-panel/30 p-3">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-xs font-black text-text">
                  {{ activeProject.name }}
                </p>
                <p class="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">
                  {{ activeProject.status }}
                </p>
              </div>
              <div
                class="h-3 w-3 shrink-0 rounded-full border border-border"
                :style="{ backgroundColor: activeProject.color_code || 'var(--ui-primary)' }"
              />
            </div>

            <div class="mt-3 grid grid-cols-2 gap-2">
              <NuxtLink
                :to="`/projects/${activeProject.id}`"
                class="rounded-lg border border-border bg-surface px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted hover:text-text hover:bg-overlay/40 transition-colors text-center"
              >
                Command
              </NuxtLink>
              <NuxtLink
                :to="`/workspace/${activeProject.id}`"
                class="rounded-lg border border-border bg-surface px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted hover:text-text hover:bg-overlay/40 transition-colors text-center"
              >
                Workspace
              </NuxtLink>
            </div>
          </div>
        </div>
      </nav>

      <div class="p-4">
        <div class="rounded-[var(--r-xl)] border border-border bg-panel/30 p-4">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-faint">
            Shell Status
          </p>
          <p class="mt-1 text-xs font-semibold text-muted">
            Mock data bound, UI rebuilding in progress.
          </p>
        </div>
      </div>
    </aside>

    <main class="flex min-w-0 flex-1 flex-col">
      <header class="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-border bg-[var(--c-bg)]/70 px-6 backdrop-blur-md lg:px-8">
        <div class="min-w-0">
          <h1 class="truncate font-display text-sm font-black tracking-tight text-text">
            {{ routeTitle }}
          </h1>
          <p
            v-if="routeSubtitle"
            class="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-faint"
          >
            {{ routeSubtitle }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <div
            v-if="activeProject"
            class="hidden items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 md:flex"
          >
            <span
              class="h-2.5 w-2.5 rounded-full"
              :style="{ backgroundColor: activeProject.color_code || 'var(--ui-primary)' }"
            />
            <span class="max-w-[240px] truncate text-[11px] font-black text-text">{{ activeProject.name }}</span>
          </div>
        </div>
      </header>

      <div class="flex-1 overflow-hidden">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { LayoutDashboard, FolderKanban, CalendarDays } from 'lucide-vue-next'
import AppLogo from '~/components/AppLogo.vue'
import { useWorkspaceStore } from '~/stores/workspace'
import { useRouteTitle } from '~/composables/useRouteTitle'

const route = useRoute()
const workspace = useWorkspaceStore()

const primaryNav = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Projects', to: '/projects', icon: FolderKanban },
  { label: 'Schedule', to: '/schedule', icon: CalendarDays }
]

const isActive = (to: string) => route.path === to || route.path.startsWith(to + '/')

const activeProjectId = computed(() => {
  const pid = route.params.projectId || route.params.id
  if (typeof pid === 'string' && pid) return pid
  return workspace.currentProject?.id || null
})

const activeProject = computed(() => {
  if (!activeProjectId.value) return null
  return workspace.projects.find(p => p.id === activeProjectId.value) || null
})

const shellStyle = computed(() => {
  const primary = activeProject.value?.color_code || 'var(--c-brand)'
  return {
    '--ui-primary': primary
  } as Record<string, string>
})

const { title: routeTitle, subtitle: routeSubtitle } = useRouteTitle({ route, activeProject })
</script>
