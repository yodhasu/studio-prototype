<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <header class="flex items-end justify-between">
        <div>
          <h1 class="font-display text-2xl font-bold tracking-tight text-text">Workspace Settings</h1>
          <p class="mt-1 text-sm text-muted">Configure preferences and studio settings.</p>
        </div>
        <button class="btn btn-primary" @click="saveSettings">
          <Save class="h-4 w-4 mr-2" /> Save Changes
        </button>
      </header>

      <div class="flex gap-8">
        <aside class="w-48 shrink-0 flex flex-col gap-2">
          <button 
            v-for="tab in ['Profile', 'Preferences', 'Notifications', 'Security']" 
            :key="tab"
            class="px-4 py-2 text-left text-sm font-bold rounded-lg transition-colors"
            :class="activeTab === tab ? 'bg-brand/10 text-brand border border-brand/20' : 'text-muted hover:bg-panel/50 hover:text-text border border-transparent'"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </aside>
        
        <section class="flex-1 dashboard-panel min-h-[400px]">
          <h3 class="text-lg font-bold text-text mb-6 border-b border-border/50 pb-4">{{ activeTab }}</h3>
          
          <div v-if="activeTab === 'Profile'" class="space-y-6 max-w-md">
            <div>
              <label class="block text-xs font-bold text-muted uppercase tracking-widest mb-2">Display Name</label>
              <input type="text" class="input-base w-full" value="Admin User" />
            </div>
            <div>
              <label class="block text-xs font-bold text-muted uppercase tracking-widest mb-2">Email Address</label>
              <input type="email" class="input-base w-full" value="admin@studioc3.com" />
            </div>
          </div>
          
          <div v-else class="flex flex-col items-center justify-center h-48 text-muted text-sm italic">
            Settings module for {{ activeTab }} is under construction.
          </div>
        </section>
      </div>

      <!-- Settings Saved Toast -->
      <div v-if="saved" class="fixed bottom-4 right-4 bg-green/10 border border-green/30 text-green p-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 min-w-[250px]">
        <CheckCircle2 class="w-5 h-5" />
        <span class="font-bold text-sm">Settings saved successfully.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Save, CheckCircle2 } from 'lucide-vue-next'

const activeTab = ref('Profile')
const saved = ref(false)

const saveSettings = () => {
  saved.value = true
  setTimeout(() => { saved.value = false }, 3000)
}
</script>
