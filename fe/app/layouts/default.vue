<template>
  <div class="flex min-h-screen bg-[var(--c-bg)] text-text selection:bg-brand/30">
    <aside class="hidden w-[260px] flex-col border-r border-border bg-surface-elevated/50 backdrop-blur-xl lg:flex">
      <div class="p-6">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 font-display text-xs font-bold tracking-widest text-brand">
            C3
          </div>
          <div>
            <h1 class="font-display text-sm font-bold tracking-tight text-text">STUDIO C3</h1>
            <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-faint">Production OS</p>
          </div>
        </div>
      </div>

      <nav class="flex-1 space-y-8 px-4 py-4">
        <div>
          <p class="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-faint/60">Execution</p>
          <div class="mt-3 space-y-1">
            <NuxtLink v-for="item in workspaceNav" :key="item.to" :to="item.to" class="nav-item group" :class="{ 'active': route.path === item.to }">
              <component :is="item.icon" class="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>{{ item.label }}</span>
            </NuxtLink>
          </div>
        </div>

        <div>
          <p class="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-faint/60">Business</p>
          <div class="mt-3 space-y-1">
            <NuxtLink v-for="item in managementNav" :key="item.to" :to="item.to" class="nav-item group" :class="{ 'active': route.path === item.to }">
              <component :is="item.icon" class="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>{{ item.label }}</span>
            </NuxtLink>
          </div>
        </div>
      </nav>

      <div class="p-4">
        <div class="rounded-xl border border-border bg-panel/50 p-4">
          <div class="flex items-center gap-3">
            <div class="h-8 w-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-[10px] font-bold text-brand">
              AD
            </div>
            <div class="flex-1 min-w-0">
              <p class="truncate text-xs font-bold text-text">Admin User</p>
              <p class="truncate text-[9px] uppercase tracking-wider text-muted font-semibold">Studio Owner</p>
            </div>
            <button @click="auth.logout" class="text-faint hover:text-red transition-colors">
              <LogOut class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>

    <main class="flex min-w-0 flex-1 flex-col">
      <header class="flex h-16 shrink-0 items-center justify-between border-b border-border bg-[var(--c-bg)]/50 px-8 backdrop-blur-md sticky top-0 z-40">
        <div class="flex items-center gap-4">
          <h2 class="font-display text-sm font-bold tracking-tight text-text">{{ pageTitle }}</h2>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="relative hidden md:block group">
            <Search class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint" />
            <input v-model="searchQuery" type="text" placeholder="Search resources..." class="h-9 w-64 rounded-lg border border-border bg-panel/50 pl-9 pr-4 text-xs outline-none focus:border-brand/50 transition-colors" />
            <!-- Search Results Dropdown -->
            <div v-if="searchQuery" class="absolute top-full left-0 w-full mt-2 bg-surface-elevated border border-border rounded-lg shadow-xl overflow-hidden z-50">
              <div class="p-3 text-xs text-muted text-center border-b border-border/50 bg-panel/30">
                Searching for "<span class="text-text font-bold">{{ searchQuery }}</span>"
              </div>
              <div class="p-4 flex flex-col items-center justify-center text-center">
                <p class="text-xs text-muted italic mb-2">Global search is currently indexing...</p>
                <button @click="searchQuery = ''" class="text-[10px] uppercase font-bold text-brand hover:underline">Clear Search</button>
              </div>
            </div>
          </div>
          <button class="relative rounded-lg border border-border p-2 text-faint hover:bg-panel transition-colors">
            <Bell class="h-4 w-4" />
            <span class="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
          </button>
        </div>
      </header>

      <div class="flex-1 overflow-hidden">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  LayoutDashboard, 
  FolderKanban, 
  CalendarDays, 
  BarChart3, 
  CreditCard, 
  Users, 
  Settings,
  Search,
  Bell,
  LogOut
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const auth = useAuthStore()
const searchQuery = ref('')

const workspaceNav = [
  { label: 'Dashboard', to: '/workspace/dashboard', icon: LayoutDashboard },
  { label: 'Projects', to: '/projects', icon: FolderKanban },
  { label: 'Schedule', to: '/schedule', icon: CalendarDays },
]

const managementNav = [
  { label: 'Studio Pulse', to: '/management/dashboard', icon: BarChart3 },
  { label: 'Finance', to: '/billing', icon: CreditCard },
  { label: 'Clients', to: '/clients', icon: Users },
  { label: 'Settings', to: '/settings', icon: Settings },
]

const pageTitle = computed(() => {
  const path = route.path
  if (path.includes('workspace')) return 'Production / Dashboard'
  if (path.includes('management')) return 'Business / Studio Pulse'
  if (path.includes('projects')) return 'Production / Projects'
  return 'Studio C3'
})
</script>
