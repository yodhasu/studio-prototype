<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <header class="flex items-end justify-between">
        <div>
          <h1 class="font-display text-2xl font-bold tracking-tight text-text">Production Schedule</h1>
          <p class="mt-1 text-sm text-muted">Timeline view of active production workstreams.</p>
        </div>
        <button class="btn btn-primary" @click="createEvent = true">
          <Plus class="h-4 w-4 mr-2" /> Schedule Event
        </button>
      </header>

      <section class="dashboard-panel">
        <div class="grid grid-cols-[100px_1fr] gap-4 text-sm" v-for="day in 7" :key="day">
          <div class="font-bold text-muted border-r border-border/50 py-4 pr-4">
            Apr {{ 10 + day }}
          </div>
          <div class="py-4 space-y-3">
            <!-- Simulated events -->
            <div v-if="day % 2 === 0" class="flex flex-col gap-2 p-3 rounded-lg border border-border bg-panel/30">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: 'rgb(var(--c-brand))' }"></div>
                <span class="font-bold text-xs text-text">Milestone Delivery</span>
                <span class="text-[10px] text-muted ml-auto">10:00 AM - 12:00 PM</span>
              </div>
            </div>
            <div v-if="day % 3 === 0" class="flex flex-col gap-2 p-3 rounded-lg border border-border bg-panel/30">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: 'rgb(var(--c-amber))' }"></div>
                <span class="font-bold text-xs text-text">Client Review Sync</span>
                <span class="text-[10px] text-muted ml-auto">2:00 PM - 3:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Placeholder Toast for interactivity -->
      <div v-if="createEvent" class="fixed bottom-4 right-4 bg-surface-elevated border border-brand/30 p-4 rounded-xl shadow-2xl z-50 flex flex-col gap-2 min-w-[250px]">
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold text-sm">Schedule Event</span>
          <button @click="createEvent = false" class="text-faint hover:text-text"><X class="w-4 h-4" /></button>
        </div>
        <p class="text-xs text-muted mb-4">Event feature coming soon.</p>
        <button class="btn btn-primary w-full" @click="createEvent = false">Acknowledge</button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, X } from 'lucide-vue-next'
import { useWorkspaceStore } from '~/stores/workspace'

const workspace = useWorkspaceStore()
const createEvent = ref(false)
</script>
