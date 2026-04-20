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
          <select class="input-base">
            <option>Select Project</option>
            <option v-for="p in workspace.projects" :key="p.id">{{ p.name }}</option>
          </select>
          <select class="input-base">
            <option>Income</option>
            <option>Expense</option>
          </select>
          <input type="number" placeholder="Amount" class="input-base" />
          <button class="btn btn-primary">Add Entry</button>
        </div>
      </section>

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
            <tr v-for="i in 5" :key="i" class="bg-surface/50 hover:bg-panel/30 transition-colors">
              <td class="px-6 py-4 text-muted">Apr 1{{ i }}, 2026</td>
              <td class="px-6 py-4 font-bold text-text">Infrastructure Migration</td>
              <td class="px-6 py-4">
                <span class="badge badge-brand">Expense</span>
              </td>
              <td class="px-6 py-4 text-muted">Consultancy Fees pass {{ i }}</td>
              <td class="px-6 py-4 text-right font-mono font-bold text-red">-$1,200.00</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkspaceStore } from '~/stores/workspace'
import { useWorkspaceBoot } from '~/composables/useWorkspaceBoot'

const workspace = useWorkspaceStore()
const { ensureSession } = useWorkspaceBoot()

onMounted(async () => {
  await ensureSession()
})
</script>
