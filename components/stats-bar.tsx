import { ClipboardList, Clock, CheckCircle2, Timer } from 'lucide-react'
import type { Stats } from '@/lib/db'
import { cn } from '@/lib/utils'

type Metric = {
  label: string
  value: string
  Icon: typeof ClipboardList
  accent: string
}

export function StatsBar({ stats }: { stats: Stats }) {
  const metrics: Metric[] = [
    {
      label: 'Total Reported',
      value: String(stats.total),
      Icon: ClipboardList,
      accent: 'text-foreground',
    },
    {
      label: 'Pending',
      value: String(stats.pending),
      Icon: Clock,
      accent: 'text-status-pending-foreground',
    },
    {
      label: 'Resolved',
      value: String(stats.resolved),
      Icon: CheckCircle2,
      accent: 'text-status-resolved-foreground',
    },
    {
      label: 'Avg Resolution',
      value: stats.avgResolutionDays == null ? '—' : `${stats.avgResolutionDays} days`,
      Icon: Timer,
      accent: 'text-accent',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {metrics.map(({ label, value, Icon, accent }) => (
        <div
          key={label}
          className="relative overflow-hidden rounded-xl border border-border/80 bg-gradient-to-br from-card to-background/40 p-4 shadow-lg backdrop-blur-md sm:p-5"
        >
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Icon className={cn('size-4', accent)} aria-hidden="true" />
            {label}
          </div>
          <p className={cn('mt-3 font-heading text-2xl font-bold tracking-tight sm:text-3xl', accent)}>
            {value}
          </p>
        </div>
      ))}
    </div>
  )
}
