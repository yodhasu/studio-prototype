<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <header class="flex items-end justify-between">
        <div>
          <h1 class="font-display text-2xl font-bold tracking-tight text-text">Studio Pulse</h1>
          <p class="mt-1 text-sm text-muted">Financial health and resource allocation overview.</p>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink to="/billing" class="btn btn-ghost">Financial Ledger</NuxtLink>
          <button class="btn btn-primary">Generate Report</button>
        </div>
      </header>

      <section class="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <DashboardMetricCard 
          label="Total Revenue" 
          value="$150,000" 
          trend="MTD" 
          detail="Total recognized revenue this month."
          tone="success"
        />
        <DashboardMetricCard 
          label="Burn Rate" 
          value="$45,000" 
          trend="Stable" 
          detail="Current monthly operational spend."
          tone="warning"
        />
        <DashboardMetricCard 
          label="Active Clients" 
          value="12" 
          trend="+2" 
          detail="Total unique clients with active projects."
          tone="brand"
        />
        <DashboardMetricCard 
          label="Open Invoices" 
          value="5" 
          trend="Attention" 
          detail="Awaiting client payment or final approval."
          tone="danger"
        />
      </section>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <article class="dashboard-panel">
          <h3 class="font-display text-lg font-bold text-text">Resource Capacity</h3>
          <p class="mt-1 text-xs text-muted">Team bandwidth snapshot across production.</p>
          
          <div class="mt-6 space-y-6">
            <div v-for="member in teamCapacity" :key="member.name" class="space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-text">{{ member.name }}</span>
                <span class="font-mono text-faint">{{ member.percent }}%</span>
              </div>
              <div class="h-1.5 overflow-hidden rounded-full bg-overlay">
                <div 
                  class="h-full rounded-full transition-all duration-500" 
                  :class="member.percent > 90 ? 'bg-red' : member.percent > 70 ? 'bg-amber' : 'bg-brand'"
                  :style="{ width: `${member.percent}%` }"
                ></div>
              </div>
            </div>
          </div>
        </article>

        <article class="dashboard-panel">
          <h3 class="font-display text-lg font-bold text-text">Client Pipeline</h3>
          <p class="mt-1 text-xs text-muted">Upcoming delivery milestones and risk signals.</p>
          
          <div class="mt-6 space-y-4">
            <div v-for="client in clientPipeline" :key="client.name" class="flex items-center justify-between p-3 rounded-lg border border-border bg-panel/30">
              <div class="min-w-0">
                <p class="truncate text-xs font-bold text-text">{{ client.name }}</p>
                <p class="truncate text-[10px] text-muted">{{ client.project }}</p>
              </div>
              <div class="text-right">
                <p class="text-[10px] font-bold text-brand uppercase tracking-wider">{{ client.status }}</p>
                <p class="text-[9px] text-faint">{{ client.milestone }}</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkspaceStore } from '~/stores/workspace'
import { useWorkspaceBoot } from '~/composables/useWorkspaceBoot'

const workspace = useWorkspaceStore()
const { ensureSession } = useWorkspaceBoot()

const teamCapacity = [
  { name: 'Alex Mercer', role: 'Lead Illustrator', percent: 95 },
  { name: 'Mira Chen', role: 'Motion Designer', percent: 72 },
  { name: 'Jules Hart', role: 'Compositor', percent: 45 },
  { name: 'Sana Patel', role: 'Coordinator', percent: 88 },
]

const clientPipeline = [
  { name: 'Northstar Labs', project: 'Orbit campaign visuals', status: 'In Production', milestone: 'Final pass due Fri' },
  { name: 'Atelier M', project: 'Packaging system', status: 'Review Loop', milestone: 'Client feedback Tue' },
  { name: 'Helio Motion', project: 'Launch kit', status: 'Final Polish', milestone: 'Delivery today' },
]

onMounted(async () => {
  await ensureSession()
  await workspace.fetchDashboardSummary()
})
</script>
