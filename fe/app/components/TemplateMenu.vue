<template>
  <div class="relative inline-block">
    <button
      type="button"
      class="-mb-[6px] rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-text transition-colors hover:bg-panel"
      :class="open ? 'bg-panel' : undefined"
      @click="open = !open"
    >
      Starter
      <span
        class="inline-block transition-transform duration-200"
        :class="open ? 'rotate-180' : undefined"
      >
        v
      </span>
    </button>

    <div
      v-if="open"
      class="absolute left-0 top-full z-20 mt-2 min-w-36 rounded-xl border border-border bg-surface p-1 shadow-lg"
    >
      <a
        v-for="item in items"
        :key="item.label"
        :href="item.to"
        class="block rounded-lg px-3 py-2 text-xs font-semibold text-muted transition-colors hover:bg-panel hover:text-text"
        target="_blank"
        rel="noreferrer"
      >
        {{ item.label }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const items = [
  { label: 'Starter', to: 'https://starter-template.nuxt.dev/' },
  { label: 'Landing', to: 'https://landing-template.nuxt.dev/' },
  { label: 'Docs', to: 'https://docs-template.nuxt.dev/' },
  { label: 'SaaS', to: 'https://saas-template.nuxt.dev/' },
  { label: 'Dashboard', to: 'https://dashboard-template.nuxt.dev/' },
  { label: 'Chat', to: 'https://chat-template.nuxt.dev/' },
  { label: 'Portfolio', to: 'https://portfolio-template.nuxt.dev/' },
  { label: 'Changelog', to: 'https://changelog-template.nuxt.dev/' }
]
</script>
