<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <header class="flex items-end justify-between">
        <div>
          <h1 class="font-display text-2xl font-bold tracking-tight text-text">Financial Ledger</h1>
          <p class="mt-1 text-sm text-muted">Track project budgets, expenses, and studio burn rate.</p>
        </div>
      </header>

      <section class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div class="project-card border-green/20 bg-green/5">
          <p class="text-[10px] font-bold uppercase tracking-widest text-green">Total Revenue</p>
          <p class="mt-4 font-display text-3xl font-bold text-green">$150,000</p>
        </div>
        <div class="project-card border-red/20 bg-red/5">
          <p class="text-[10px] font-bold uppercase tracking-widest text-red">Total Expenses</p>
          <p class="mt-4 font-display text-3xl font-bold text-red">$45,000</p>
        </div>
        <div class="project-card border-brand/20 bg-brand/5">
          <p class="text-[10px] font-bold uppercase tracking-widest text-brand">Net Profit</p>
          <p class="mt-4 font-display text-3xl font-bold text-text">$105,000</p>
        </div>
      </section>

      <section class="dashboard-panel">
        <h3 class="text-xs font-bold text-muted uppercase tracking-widest mb-6">Record New Transaction</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select class="input-base" v-model="newEntry.project">
            <option value="" disabled>Select Project</option>
            <option v-for="p in workspace.projects" :key="p.id" :value="p.name">{{ p.name }}</option>
          </select>
          <select class="input-base" v-model="newEntry.type">
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          <input type="number" placeholder="Amount" class="input-base" v-model.number="newEntry.amount" />
          <button class="btn btn-primary" @click="addTransaction" :disabled="!newEntry.project || !newEntry.amount">Add Entry</button>
        </div>
      </section>

      <!-- Success Toast -->
      <div v-if="saved" class="fixed bottom-4 right-4 bg-green/10 border border-green/30 text-green p-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 min-w-[250px]">
        <span class="font-bold text-sm">Transaction recorded.</span>
      </div>

      <section class="overflow-hidden rounded-xl border border-border">
        <table class="w-full text-left text-sm">
          <thead class="bg-panel text-[10px] uppercase font-bold text-faint">
            <tr>
              <th class="px-6 py-4">Date</th>
              <th class="px-6 py-4">Project</th>
              <th class="px-6 py-4">Type</th>
              <th class="px-6 py-4">Description</th>
              <th class="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/50">
            <tr v-for="(tx, idx) in transactions" :key="idx" class="bg-surface/50 hover:bg-panel/30 transition-colors">
              <td class="px-6 py-4 text-muted">{{ tx.date }}</td>
              <td class="px-6 py-4 font-bold text-text">{{ tx.project }}</td>
              <td class="px-6 py-4">
                <span class="badge" :class="tx.type === 'Income' ? 'badge-green' : 'badge-brand'">{{ tx.type }}</span>
              </td>
              <td class="px-6 py-4 text-muted">{{ tx.desc }}</td>
              <td class="px-6 py-4 text-right font-mono font-bold" :class="tx.type === 'Income' ? 'text-green' : 'text-red'">
                {{ tx.type === 'Income' ? '+' : '-' }}${{ tx.amount.toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWorkspaceStore } from '~/stores/workspace'
import { useWorkspaceBoot } from '~/composables/useWorkspaceBoot'

const workspace = useWorkspaceStore()
const { ensureSession } = useWorkspaceBoot()

const saved = ref(false)
const newEntry = ref({
  project: '',
  type: 'Expense',
  amount: null as number | null
})

const transactions = ref([
  { date: 'Apr 11, 2026', project: 'Project C3', type: 'Income', desc: 'Initial Retainer', amount: 3500 },
  { date: 'Apr 12, 2026', project: 'Infrastructure Migration', type: 'Expense', desc: 'Consultancy Fees', amount: 1200 },
])

const addTransaction = () => {
  if (!newEntry.value.project || !newEntry.value.amount) return
  transactions.value.unshift({
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    project: newEntry.value.project,
    type: newEntry.value.type,
    desc: 'Manual Entry',
    amount: newEntry.value.amount
  })
  saved.value = true
  setTimeout(() => { saved.value = false }, 3000)
  newEntry.value.amount = null
}

onMounted(async () => {
  await ensureSession()
})
</script>
