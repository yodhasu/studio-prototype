<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-4xl space-y-6">
      <header class="sketch-border bg-surface p-6">
        <p class="text-[10px] font-black uppercase tracking-widest text-faint">
          Module Stub
        </p>
        <h1 class="mt-3 font-display text-2xl font-black tracking-tight text-text">
          Management
        </h1>
        <p class="mt-3 text-sm text-muted">
          Business dashboards (revenue, burn, invoices, client pipeline) are excluded from Phase 1.
          This route is preserved only as a placeholder.
        </p>

        <div class="mt-5 flex flex-wrap gap-3">
          <NuxtLink
            class="btn btn-primary"
            to="/dashboard"
          >Back to Dashboard</NuxtLink>
          <NuxtLink
            class="btn"
            to="/projects"
          >Projects</NuxtLink>
        </div>
      </header>

      <section class="dashboard-panel">
        <p class="text-xs font-bold uppercase tracking-widest text-muted">
          Status
        </p>
        <div class="mt-4 rounded-xl border border-border bg-panel/20 p-4">
          <p class="text-sm text-text">
            <span class="font-bold">Disabled.</span> Await Phase 3.
          </p>
          <p class="mt-2 text-xs text-muted">
            No state changes occur on this page.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>
