<template>
  <div class="login-page">
    <!-- Decorative background pattern -->
    <div class="login-bg-pattern" />

    <div class="login-container">
      <!-- Brand lockup -->
      <div class="login-brand">
        <div class="login-brand-mark">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="var(--c-brand)" />
            <path d="M8 12h16M8 16h12M8 20h8" stroke="var(--c-bg)" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div>
        <h1 class="login-brand-name">TTMC3</h1>
        <p class="login-brand-tagline">Workspace Management Platform</p>
      </div>

      <!-- Login card -->
      <div class="login-card">
        <div class="login-card-header">
          <h2 class="login-card-title">Sign in to your account</h2>
          <p class="login-card-subtitle">Enter your credentials to continue</p>
        </div>

        <form class="login-form" @submit.prevent="submit">
          <div class="login-field">
            <label for="login-email" class="login-label">Email</label>
            <div class="login-input-wrap" :class="{ 'has-error': emailError }">
              <svg class="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                id="login-email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                class="login-input"
                @focus="emailError = ''"
              >
            </div>
            <p v-if="emailError" class="login-field-error">{{ emailError }}</p>
          </div>

          <div class="login-field">
            <label for="login-password" class="login-label">Password</label>
            <div class="login-input-wrap" :class="{ 'has-error': passwordError }">
              <svg class="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="login-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••"
                class="login-input"
                @focus="passwordError = ''"
              >
              <button
                type="button"
                class="login-toggle-pw"
                tabindex="-1"
                @click="showPassword = !showPassword"
              >
                <!-- Eye / Eye-off -->
                <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                  <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                  <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                  <path d="m2 2 20 20" />
                </svg>
              </button>
            </div>
            <p v-if="passwordError" class="login-field-error">{{ passwordError }}</p>
          </div>

          <!-- Auth error -->
          <div v-if="authError" class="login-auth-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{{ authError }}</span>
          </div>

          <button
            type="submit"
            class="login-submit"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="login-spinner" />
            <span>{{ isSubmitting ? 'Signing in…' : 'Sign in' }}</span>
          </button>
        </form>
      </div>

      <!-- Credentials hint (collapsible) -->
      <div class="login-hint-section">
        <button
          type="button"
          class="login-hint-toggle"
          @click="showHint = !showHint"
        >
          <svg
            class="login-hint-chevron"
            :class="{ open: showHint }"
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
          <span>Demo credentials</span>
        </button>

        <Transition name="hint-expand">
          <div v-if="showHint" class="login-hint-table">
            <div
              v-for="acc in accounts"
              :key="acc.id"
              class="login-hint-row"
              @click="fillCredentials(acc)"
            >
              <div class="login-hint-tier">
                <span class="login-hint-badge" :class="`login-hint-badge--${acc.tier.toLowerCase()}`">
                  {{ acc.tier }}
                </span>
              </div>
              <div class="login-hint-creds">
                <span class="login-hint-email">{{ acc.email }}</span>
                <span class="login-hint-pw">{{ acc.password }}</span>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Footer -->
      <p class="login-footer">&copy; 2026 TTMC3 &middot; Workspace Management Platform</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { MOCK_LOGIN_ACCOUNTS, useAuthStore, type MockLoginAccount } from '~/stores/auth'

definePageMeta({ layout: false })

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const accounts = MOCK_LOGIN_ACCOUNTS

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const showHint = ref(false)
const isSubmitting = ref(false)

const emailError = ref('')
const passwordError = ref('')
const authError = ref('')

function validate(): boolean {
  let valid = true
  emailError.value = ''
  passwordError.value = ''
  authError.value = ''

  if (!email.value.trim()) {
    emailError.value = 'Email is required.'
    valid = false
  }
  if (!password.value) {
    passwordError.value = 'Password is required.'
    valid = false
  }
  return valid
}

async function submit() {
  if (!validate()) return

  isSubmitting.value = true
  authError.value = ''

  // Simulate network latency for realism
  await new Promise(r => setTimeout(r, 600))

  const ok = auth.login(email.value, password.value)
  isSubmitting.value = false

  if (!ok) {
    authError.value = auth.lastError || 'Invalid email or password.'
    return
  }
  router.replace('/dashboard')
}

function fillCredentials(acc: MockLoginAccount) {
  email.value = acc.email
  password.value = acc.password
  emailError.value = ''
  passwordError.value = ''
  authError.value = ''
}

onMounted(() => {
  const account = typeof route.query.account === 'string' ? route.query.account : ''
  if (!account) return

  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
  const ok = auth.quickLogin(account)
  if (!ok) return
  router.replace(redirect)
})
</script>

<style scoped>
/* ─── Page layout ───────────────────────────────── */
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--c-bg);
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden;
}

.login-bg-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, var(--c-border) 1px, transparent 1px);
  background-size: 28px 28px;
  opacity: 0.4;
  pointer-events: none;
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

/* ─── Brand lockup ──────────────────────────────── */
.login-brand {
  text-align: center;
}

.login-brand-mark {
  display: inline-flex;
  margin-bottom: 0.75rem;
  animation: brand-fade-in 0.8s var(--ease-out-expo) both;
}

.login-brand-name {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  color: var(--c-text);
  animation: brand-fade-in 0.8s 0.1s var(--ease-out-expo) both;
}

.login-brand-tagline {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: var(--c-muted);
  animation: brand-fade-in 0.8s 0.2s var(--ease-out-expo) both;
}

@keyframes brand-fade-in {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ─── Card ──────────────────────────────────────── */
.login-card {
  width: 100%;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-xl);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  animation: card-enter 0.6s 0.2s var(--ease-out-expo) both;
}

@keyframes card-enter {
  from { opacity: 0; transform: translateY(16px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.login-card-header {
  margin-bottom: 1.75rem;
}

.login-card-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--c-text);
}

.login-card-subtitle {
  margin-top: 0.35rem;
  font-size: 0.8rem;
  color: var(--c-muted);
}

/* ─── Form ──────────────────────────────────────── */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.login-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.login-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--c-text);
  letter-spacing: 0.02em;
}

.login-input-wrap {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  padding: 0 0.875rem;
  background: var(--c-surface);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.login-input-wrap:focus-within {
  border-color: var(--c-brand);
  box-shadow: 0 0 0 3px rgba(50, 50, 50, 0.06);
}

.login-input-wrap.has-error {
  border-color: var(--c-red);
  box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.1);
}

.login-input-icon {
  flex-shrink: 0;
  color: var(--c-faint);
}

.login-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.875rem;
  color: var(--c-text);
  padding: 0.7rem 0;
  font-family: inherit;
}

.login-input::placeholder {
  color: var(--c-faint);
}

.login-toggle-pw {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--c-faint);
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.15s;
}

.login-toggle-pw:hover {
  color: var(--c-muted);
}

.login-field-error {
  font-size: 0.7rem;
  color: var(--c-red);
  font-weight: 600;
}

/* ─── Auth error banner ─────────────────────────── */
.login-auth-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 0.875rem;
  background: rgba(248, 113, 113, 0.08);
  border: 1px solid rgba(248, 113, 113, 0.25);
  border-radius: var(--r-md);
  color: var(--c-red);
  font-size: 0.8rem;
  font-weight: 600;
  animation: shake 0.35s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-4px); }
  40%      { transform: translateX(4px); }
  60%      { transform: translateX(-3px); }
  80%      { transform: translateX(2px); }
}

/* ─── Submit button ─────────────────────────────── */
.login-submit {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--c-bg);
  background: var(--c-brand);
  border: none;
  border-radius: var(--r-md);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-brand);
}

.login-submit:hover:not(:disabled) {
  background: var(--c-brand-hi);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px -4px rgba(0, 0, 0, 0.25);
}

.login-submit:active:not(:disabled) {
  transform: translateY(0);
}

.login-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.login-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ─── Hint section ──────────────────────────────── */
.login-hint-section {
  width: 100%;
  animation: card-enter 0.6s 0.35s var(--ease-out-expo) both;
}

.login-hint-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--c-muted);
  padding: 0.25rem 0;
  transition: color 0.15s;
}

.login-hint-toggle:hover {
  color: var(--c-text);
}

.login-hint-chevron {
  transition: transform 0.25s var(--ease-out-expo);
}

.login-hint-chevron.open {
  transform: rotate(180deg);
}

.login-hint-table {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.login-hint-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.875rem;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  cursor: pointer;
  transition: all 0.2s;
}

.login-hint-row:hover {
  border-color: var(--c-brand);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.login-hint-tier {
  flex-shrink: 0;
}

.login-hint-badge {
  display: inline-block;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  min-width: 72px;
  text-align: center;
}

.login-hint-badge--free {
  background: rgba(74, 222, 128, 0.12);
  color: #22c55e;
  border: 1px solid rgba(74, 222, 128, 0.25);
}

.login-hint-badge--pro {
  background: rgba(120, 160, 180, 0.12);
  color: var(--c-cyan);
  border: 1px solid rgba(120, 160, 180, 0.25);
}

.login-hint-badge--enterprise {
  background: rgba(251, 191, 36, 0.1);
  color: #d97706;
  border: 1px solid rgba(251, 191, 36, 0.25);
}

.login-hint-creds {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.login-hint-email {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--c-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.login-hint-pw {
  font-size: 0.7rem;
  font-family: var(--font-mono-ui);
  color: var(--c-faint);
}

/* ─── Hint expand transition ────────────────────── */
.hint-expand-enter-active,
.hint-expand-leave-active {
  transition: all 0.3s var(--ease-out-expo);
  overflow: hidden;
}
.hint-expand-enter-from,
.hint-expand-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
}
.hint-expand-enter-to,
.hint-expand-leave-from {
  opacity: 1;
  max-height: 300px;
  margin-top: 0.75rem;
}

/* ─── Footer ────────────────────────────────────── */
.login-footer {
  font-size: 0.7rem;
  color: var(--c-faint);
  text-align: center;
  animation: brand-fade-in 0.8s 0.5s var(--ease-out-expo) both;
}
</style>
