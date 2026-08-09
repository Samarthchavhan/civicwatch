import Link from 'next/link'
import { ClipboardList, Lock, ShieldCheck } from 'lucide-react'
import { getIssues, getStats } from '@/lib/db'
import { isAdmin } from '@/lib/admin'
import { IssueCard } from '@/components/issue-card'
import { StatsBar } from '@/components/stats-bar'
import { ReportPanel } from '@/components/report-panel'
import { AdminBar } from '@/components/admin-bar'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const [issues, stats, admin] = await Promise.all([getIssues(), getStats(), isAdmin()])

  return (
    <div className="min-h-screen">
      {admin && <AdminBar />}

      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-4.5" aria-hidden="true" />
            </span>
            <span className="font-heading text-base font-bold tracking-tight text-foreground">
              CivicWatch
            </span>
          </div>
          <ReportPanel />
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(60% 55% at 20% 0%, oklch(0.82 0.15 75 / 0.14), transparent 70%), radial-gradient(55% 50% at 90% 20%, oklch(0.85 0.16 172 / 0.12), transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            Serving the residents of Kalyan
          </span>
          <h1 className="mt-5 max-w-3xl text-balance font-heading text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            CivicWatch: Local Accountability,{' '}
            <span className="text-primary">Tracked Real-Time</span>
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Report potholes and broken infrastructure across Kalyan in seconds. Every submission is
            logged publicly and tracked from Pending to Officially Filed to Resolved — so nothing
            slips through the cracks.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ReportPanel variant="hero" label="Report an issue" />
            <a
              href="#feed"
              className="inline-flex h-11 items-center rounded-md border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:bg-card"
            >
              View the feed
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section aria-label="Overview statistics" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <StatsBar stats={stats} />
      </section>

      {/* Feed */}
      <main id="feed" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Community reports
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Live feed of infrastructure issues reported across the city.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground">
            <span className="text-status-pending-foreground">{stats.pending} pending</span>
            <span className="text-status-filed-foreground">{stats.filed} filed</span>
            <span className="text-status-resolved-foreground">{stats.resolved} resolved</span>
          </div>
        </div>

        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/40 px-6 py-20 text-center">
            <ClipboardList className="size-9 text-muted-foreground" aria-hidden="true" />
            <p className="font-heading text-lg font-semibold text-foreground">No reports yet</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Be the first to report an issue in your neighborhood.
            </p>
            <div className="mt-2">
              <ReportPanel label="File the first report" />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} isAdmin={admin} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center sm:px-6">
          <p className="text-xs text-muted-foreground">
            CivicWatch — community infrastructure reporting for Kalyan. Reports are reviewed by your
            local public works department.
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground/70 transition-colors hover:text-foreground"
          >
            <Lock className="size-3" aria-hidden="true" />
            {admin ? 'Admin dashboard' : 'Admin access'}
          </Link>
        </div>
      </footer>
    </div>
  )
}
