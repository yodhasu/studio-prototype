<template>
  <div class="min-h-screen bg-[var(--c-bg)] p-6 text-text">
    <div class="mx-auto mt-10 max-w-5xl space-y-8">
      <header>
        <p class="text-[10px] font-black uppercase tracking-[0.18em] text-faint">
          TTMC3
        </p>
        <h1 class="mt-2 font-display text-3xl font-black">
          Login
        </h1>
        <p class="mt-2 text-sm text-muted">
          Mock auth module for tier-based view control.
        </p>
      </header>

      <section class="dashboard-panel">
        <h2 class="font-display text-lg font-bold">
          Quick accounts
        </h2>
        <div class="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <button
            v-for="acc in accounts"
            :key="acc.id"
            class="rounded-xl border border-border bg-panel/20 p-4 text-left hover:border-brand/30"
            type="button"
            @click="quickLogin(acc.id)"
          >
            <p class="text-sm font-bold text-text">
              {{ acc.label }}
            </p>
            <p class="mt-1 text-[10px] font-black uppercase tracking-widest text-faint">
              {{ acc.tier }}
            </p>
            <p class="mt-2 text-xs text-muted">
              {{ acc.email }}
            </p>
          </button>
        </div>
      </section>

      <section class="dashboard-panel max-w-xl">
        <h2 class="font-display text-lg font-bold">
          Manual login
        </h2>
        <div class="mt-4 space-y-3">
          <input
            v-model="email"
            class="input-base sketch-border"
            placeholder="Email"
          >
          <input
            v-model="password"
            type="password"
            class="input-base sketch-border"
            placeholder="Password"
          >

          <p
            v-if="auth.lastError"
            class="text-xs text-red-400"
          >
            {{ auth.lastError }}
          </p>

          <button
            class="btn btn-primary"
            type="button"
            @click="submit"
          >
            Login
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MOCK_LOGIN_ACCOUNTS, useAuthStore } from '~/stores/auth'

definePageMeta({ layout: false })

const auth = useAuthStore()
const router = useRouter()

const accounts = MOCK_LOGIN_ACCOUNTS

const email = ref('')
const password = ref('')

function quickLogin(accountId: string) {
  const ok = auth.quickLogin(accountId)
  if (!ok) return
  router.replace('/dashboard')
}

function submit() {
  const ok = auth.login(email.value, password.value)
  if (!ok) return
  router.replace('/dashboard')
}
</script>
