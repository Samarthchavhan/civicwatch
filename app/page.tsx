import { ClipboardList, ShieldCheck } from 'lucide-react'
import { getIssues } from '@/lib/db'
import { ReportForm } from '@/components/report-form'
import { IssueCard } from '@/components/issue-card'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const issues = await getIssues()

  const counts = {
    total: issues.length,
    pending: issues.filter((i) => i.status === 'Pending').length,
    filed: issues.filter((i) => i.status === 'Officially Filed').length,
    resolved: issues.filter((i) => i.status === 'Resolved').length,
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary-foreground/15">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <span className="font-heading text-lg font-bold tracking-tight">CivicWatch</span>
          </div>
          <div className="max-w-2xl">
            <h1 className="text-balance font-heading text-3xl font-bold leading-tight sm:text-4xl">
              Report a pothole. Track it to resolution.
            </h1>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
              Submit local infrastructure issues with a photo, location, and date. Every report is
              logged publicly and moves from Pending to Officially Filed to Resolved.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[380px_1fr] lg:items-start">
        <section
          aria-labelledby="report-heading"
          className="rounded-xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-6"
        >
          <div className="mb-5 flex items-center gap-2">
            <ClipboardList className="size-5 text-primary" aria-hidden="true" />
            <h2 id="report-heading" className="font-heading text-lg font-bold text-card-foreground">
              File a new report
            </h2>
          </div>
          <ReportForm />
        </section>

        <section aria-labelledby="feed-heading" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="feed-heading" className="font-heading text-xl font-bold text-foreground">
              Community reports
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground">
              <span>{counts.total} total</span>
              <span className="text-status-pending-foreground">{counts.pending} pending</span>
              <span className="text-status-filed-foreground">{counts.filed} filed</span>
              <span className="text-status-resolved-foreground">{counts.resolved} resolved</span>
            </div>
          </div>

          {issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
              <ClipboardList className="size-8 text-muted-foreground" aria-hidden="true" />
              <p className="font-medium text-foreground">No reports yet</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Be the first to report an issue in your neighborhood using the form.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-border py-6">
        <p className="mx-auto max-w-5xl px-4 text-center text-xs text-muted-foreground sm:px-6">
          CivicWatch is a community reporting tool. Reports are reviewed by your local public works
          department.
        </p>
      </footer>
    </div>
  )
}
