<template>
  <div
    class="h-screen flex overflow-hidden bg-[var(--c-bg)] text-text selection:bg-brand/20"
    :style="shellStyle"
  >
    <!-- Sidebar: fixed viewport height, scrolls independently -->
    <aside class="hidden w-[272px] h-screen shrink-0 flex-col border-r border-border bg-surface-elevated/60 backdrop-blur-xl lg:flex">
      <div class="relative p-6" ref="workspaceSwitcherRef">
        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-xl p-2 -m-2 text-left transition-colors hover:bg-panel/50"
          @click="workspaceSwitcherOpen = !workspaceSwitcherOpen"
        >
          <div class="h-9 w-9 shrink-0 rounded-xl border border-border bg-panel/40 p-2 text-brand">
            <AppLogo class="h-full w-full" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-[11px] font-black uppercase tracking-[0.18em] text-text">
              {{ activeWorkspace?.name || 'Studio Prototype' }}
            </p>
            <p class="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-faint">Workspace</p>
          </div>
          <ChevronDown class="h-4 w-4 shrink-0 text-faint transition-transform" :class="{ 'rotate-180': workspaceSwitcherOpen }" />
        </button>

        <Transition name="dropdown-fade">
          <div
            v-if="workspaceSwitcherOpen"
            class="absolute left-6 right-6 top-[76px] z-50 rounded-xl border border-border bg-surface p-2 shadow-2xl"
          >
            <p class="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-faint">Your Workspaces</p>
            <div class="mt-1 space-y-1">
              <button
                v-for="ws in userWorkspaces"
                :key="ws.id"
                type="button"
                class="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm font-semibold transition-colors hover:bg-panel/50"
                @click="switchWorkspace(ws.id)"
              >
                <span class="truncate" :class="ws.id === activeWorkspace?.id ? 'text-brand' : 'text-text'">
                  {{ ws.name }}
                </span>
                <Check v-if="ws.id === activeWorkspace?.id" class="h-4 w-4 text-brand" />
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <nav class="flex-1 overflow-y-auto px-4 pb-6">
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

      <div class="shrink-0 p-4">
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

    <!-- Main content: fills remaining width, scrolls independently -->
    <div class="flex-1 min-w-0 h-screen flex flex-col">
      <header class="shrink-0 z-40 flex h-16 items-center justify-between border-b border-border bg-[var(--c-bg)]/70 px-6 backdrop-blur-md lg:px-8">
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

          <!-- User profile avatar + dropdown -->
          <div class="relative" ref="profileRef">
            <button
              type="button"
              class="profile-avatar-btn"
              @click="profileOpen = !profileOpen"
            >
              <span class="profile-avatar-initials">{{ userInitials }}</span>
            </button>

            <Transition name="dropdown-fade">
              <div
                v-if="profileOpen"
                class="profile-dropdown"
              >
                <!-- User info -->
                <div class="profile-dropdown-header">
                  <div class="profile-dropdown-avatar">
                    <span class="profile-avatar-initials text-[11px]">{{ userInitials }}</span>
                  </div>
                  <div class="min-w-0">
                    <p class="truncate text-xs font-bold text-text">{{ accountLabel }}</p>
                    <p class="truncate text-[10px] text-faint">{{ accountEmail }}</p>
                  </div>
                </div>

                <div class="profile-dropdown-divider" />

                <!-- Menu items -->
                <NuxtLink
                  to="/settings"
                  class="profile-dropdown-item"
                  @click="profileOpen = false"
                >
                  <Settings class="h-3.5 w-3.5" />
                  <span>Account Settings</span>
                </NuxtLink>

                <div class="profile-dropdown-divider" />

                <button
                  type="button"
                  class="profile-dropdown-item profile-dropdown-item--danger"
                  @click="logout"
                >
                  <LogOut class="h-3.5 w-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto premium-scroll">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { LayoutDashboard, FolderKanban, CalendarDays, Users, Settings, LogOut, ChevronDown, Check } from 'lucide-vue-next'
import AppLogo from '~/components/AppLogo.vue'
import { useWorkspaceStore } from '~/stores/workspace'
import { useAuthStore } from '~/stores/auth'
import { useRouteTitle } from '~/composables/useRouteTitle'

const route = useRoute()
const router = useRouter()
const workspace = useWorkspaceStore()
const auth = useAuthStore()

const primaryNav = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Projects', to: '/projects', icon: FolderKanban },
  { label: 'Schedule', to: '/schedule', icon: CalendarDays },
  { label: 'Team', to: '/teams', icon: Users },
  { label: 'Settings', to: '/settings', icon: Settings }
]

const isActive = (to: string) => route.path === to || route.path.startsWith(to + '/')

const activeProjectId = computed(() => {
  const pid = route.params.projectId || route.params.id
  if (typeof pid === 'string' && pid) return pid
  return workspace.currentProjectId || null
})

const activeProject = computed(() => {
  if (!activeProjectId.value) return null
  return workspace.getProjectById(activeProjectId.value) || null
})

const shellStyle = computed(() => {
  const primary = activeProject.value?.color_code || 'var(--c-brand)'
  return {
    '--ui-primary': primary
  } as Record<string, string>
})

const accountLabel = computed(() => auth.currentAccount?.label || 'Session')
const accountEmail = computed(() => auth.currentAccount?.email || '—')
const accountTier = computed(() => auth.currentAccount?.tier || '—')

const userInitials = computed(() => {
  const name = accountLabel.value
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase()
  return name.slice(0, 2).toUpperCase()
})

// Profile dropdown
const profileOpen = ref(false)
const profileRef = ref<HTMLElement | null>(null)

const workspaceSwitcherOpen = ref(false)
const workspaceSwitcherRef = ref<HTMLElement | null>(null)

function handleClickOutside(e: MouseEvent) {
  if (profileRef.value && !profileRef.value.contains(e.target as Node)) {
    profileOpen.value = false
  }
  if (workspaceSwitcherRef.value && !workspaceSwitcherRef.value.contains(e.target as Node)) {
    workspaceSwitcherOpen.value = false
  }
}

const activeWorkspace = computed(() => workspace.workspaces.find(w => w.id === workspace.active_workspace_id))

const userWorkspaces = computed(() => {
  const uid = workspace.active_user_id
  const memberWsIds = new Set(workspace.workspace_members.filter(wm => wm.user_id === uid).map(wm => wm.workspace_id))
  return workspace.workspaces.filter(w => memberWsIds.has(w.id))
})

function switchWorkspace(id: string) {
  workspace.active_workspace_id = id
  workspaceSwitcherOpen.value = false
  router.push('/dashboard')
}

onMounted(() => document.addEventListener('click', handleClickOutside, true))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside, true))

function logout() {
  profileOpen.value = false
  auth.logout()
  router.replace('/login')
}

const { title: routeTitle, subtitle: routeSubtitle } = useRouteTitle({ route, activeProject })
</script>

<style scoped>
/* ─── Profile avatar button ─────────────────────── */
.profile-avatar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--c-brand);
  border: 2px solid var(--c-border);
  cursor: pointer;
  transition: all 0.2s;
}

.profile-avatar-btn:hover {
  border-color: var(--c-brand-hi);
  box-shadow: 0 0 0 3px rgba(50, 50, 50, 0.08);
  transform: scale(1.05);
}

.profile-avatar-initials {
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--c-bg);
  letter-spacing: 0.04em;
  line-height: 1;
}

/* ─── Dropdown panel ────────────────────────────── */
.profile-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 240px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-lg);
  z-index: 100;
  padding: 0.375rem;
}

.profile-dropdown-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.5rem;
}

.profile-dropdown-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--c-brand);
  flex-shrink: 0;
}

.profile-dropdown-divider {
  height: 1px;
  background: var(--c-border);
  margin: 0.25rem 0;
}

.profile-dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem;
  border-radius: var(--r-sm);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--c-muted);
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  text-decoration: none;
}

.profile-dropdown-item:hover {
  background: var(--c-panel);
  color: var(--c-text);
}

.profile-dropdown-item--danger {
  color: var(--c-red);
}

.profile-dropdown-item--danger:hover {
  background: rgba(248, 113, 113, 0.08);
  color: var(--c-red);
}

/* ─── Dropdown transition ───────────────────────── */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.96);
}
</style>
