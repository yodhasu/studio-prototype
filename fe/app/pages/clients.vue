<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <header class="flex items-end justify-between">
        <div>
          <h1 class="font-display text-2xl font-bold tracking-tight text-text">Client Directory</h1>
          <p class="mt-1 text-sm text-muted">Manage active studio partners and client contacts.</p>
        </div>
        <button class="btn btn-primary" @click="createClient = true">
          <Plus class="h-4 w-4 mr-2" /> Add Client
        </button>
      </header>

      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="dashboard-panel group hover:border-brand/30 transition-colors">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-full bg-panel border border-border flex items-center justify-center font-bold text-xl text-brand">
              {{ String.fromCharCode(64 + i) }}
            </div>
            <div>
              <h3 class="font-bold text-sm text-text">Studio Client {{ i }}</h3>
              <p class="text-[10px] text-muted">{{ i * 2 }} Active Projects</p>
            </div>
          </div>
          <div class="pt-4 border-t border-border/50 text-xs text-muted flex flex-col gap-1">
            <span class="flex items-center gap-2"><Mail class="w-3 h-3 text-faint" /> contact@client{{ i }}.com</span>
            <span class="flex items-center gap-2"><Phone class="w-3 h-3 text-faint" /> +1 (555) 010-{{ i }}234</span>
          </div>
        </div>
      </section>

      <!-- Placeholder Toast for interactivity -->
      <div v-if="createClient" class="fixed bottom-4 right-4 bg-surface-elevated border border-brand/30 p-4 rounded-xl shadow-2xl z-50 flex flex-col gap-2 min-w-[250px]">
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold text-sm">Add Client</span>
          <button @click="createClient = false" class="text-faint hover:text-text"><X class="w-4 h-4" /></button>
        </div>
        <p class="text-xs text-muted mb-4">Client management coming soon.</p>
        <button class="btn btn-primary w-full" @click="createClient = false">Acknowledge</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, X, Mail, Phone } from 'lucide-vue-next'

const createClient = ref(false)
</script>
