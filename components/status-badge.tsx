import { CircleDot, FileCheck, CheckCircle2 } from 'lucide-react'
import type { IssueStatus } from '@/lib/db'
import { cn } from '@/lib/utils'

const config: Record<
  IssueStatus,
  { label: string; className: string; Icon: typeof CircleDot }
> = {
  Pending: {
    label: 'Pending',
    className: 'bg-status-pending text-status-pending-foreground',
    Icon: CircleDot,
  },
  'Officially Filed': {
    label: 'Officially Filed',
    className: 'bg-status-filed text-status-filed-foreground',
    Icon: FileCheck,
  },
  Resolved: {
    label: 'Resolved',
    className: 'bg-status-resolved text-status-resolved-foreground',
    Icon: CheckCircle2,
  },
}

export function StatusBadge({ status }: { status: IssueStatus }) {
  const { label, className, Icon } = config[status] ?? config.Pending

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide',
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  )
}
