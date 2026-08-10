import { CalendarDays, MapPin, FileText } from 'lucide-react'
import type { Issue } from '@/lib/db'
import { StatusBadge } from '@/components/status-badge'
import { AdminControls } from '@/components/admin-controls'

function formatDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function IssueCard({ issue, index = 0, isAdmin = false }: { issue: Issue & { complaint_no?: string; complaintNo?: string }; index?: number; isAdmin?: boolean }) {
  const complaintReference = issue.complaint_no || issue.complaintNo

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-lg transition-colors hover:border-primary/40">
      {issue.photo_pathname ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/api/file?pathname=${encodeURIComponent(issue.photo_pathname)}`}
          alt={`Reported issue at ${issue.location}`}
          className="h-44 w-full bg-muted object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-44 w-full items-center justify-center bg-muted text-sm text-muted-foreground">
          No photo provided
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <span className="font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Report #{String(index + 1).padStart(4, '0')}
          </span>
          <div className="flex items-center gap-2">
            {complaintReference && (
              <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs font-mono font-semibold text-foreground">
                <FileText className="size-3 text-muted-foreground" aria-hidden="true" />
                {complaintReference}
              </span>
            )}
            <StatusBadge status={issue.status} />
          </div>
        </div>

        <p className="text-pretty text-sm leading-relaxed text-card-foreground">
          {issue.description}
        </p>

        <div className="mt-auto flex flex-col gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="text-foreground">{issue.location}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
            Observed {formatDate(issue.issue_date)}
          </span>
        </div>

        {isAdmin && <AdminControls issue={issue} />}
      </div>
    </article>
  )
}