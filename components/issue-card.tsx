import type { Issue } from '@/lib/db'
import { AdminControls } from '@/components/admin-controls'
import { MapPin, Calendar, FileText } from 'lucide-react'

export function IssueCard({ issue, isAdmin }: { issue: Issue & { complaint_no?: string; complaintNo?: string }; isAdmin: boolean }) {
  const complaintReference = issue.complaint_no || issue.complaintNo

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md">
      {/* Image Section: Agar photo nahi hai toh box hide ho jayega, faltu "No photo" nahi dikhega */}
      {issue.photo_pathname && (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <img
            src={`/api/placeholder-image?path=${issue.photo_pathname}`}
            alt="Reported issue"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Header row: Status Badge & Complaint Number Badge (Sabhi users ko dikhega) */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            issue.status === 'Resolved' 
              ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
              : issue.status === 'Officially Filed' 
              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
              : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
          }`}>
            {issue.status}
          </span>

          {complaintReference && (
            <div className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
              <FileText className="size-3" />
              <span>Ref: {complaintReference}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm font-medium text-foreground leading-relaxed mb-4">
          {issue.description}
        </p>

        {/* Location and Date Metadata */}
        <div className="mt-auto space-y-1.5 text-xs text-muted-foreground border-t border-border/40 pt-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0 text-muted-foreground/70" />
            <span className="truncate">{issue.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5 shrink-0 text-muted-foreground/70" />
            <span>Observed {issue.issue_date}</span>
          </div>
        </div>

        {/* Admin Controls (Only visible if logged in as admin) */}
        {isAdmin && <AdminControls issue={issue} />}
      </div>
    </div>
  )
}