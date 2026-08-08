'use client'

import { useState, useTransition } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import type { Issue, IssueStatus } from '@/lib/db'
import { deleteIssue, updateIssueStatus } from '@/app/actions'

const STATUSES: IssueStatus[] = ['Pending', 'Officially Filed', 'Resolved']

const SHORT_LABEL: Record<IssueStatus, string> = {
  Pending: 'Pending',
  'Officially Filed': 'Filed',
  Resolved: 'Resolved',
}

export function AdminControls({ issue }: { issue: Issue }) {
  const [isPending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function setStatus(status: IssueStatus) {
    if (status === issue.status || isPending) return
    setError(null)
    startTransition(async () => {
      const res = await updateIssueStatus(issue.id, status)
      if (!res.ok) setError(res.error ?? 'Something went wrong.')
    })
  }

  function remove() {
    setError(null)
    startTransition(async () => {
      const res = await deleteIssue(issue.id)
      if (!res.ok) setError(res.error ?? 'Something went wrong.')
    })
  }

  return (
    <div className="mt-3 rounded-lg border border-dashed border-border bg-background/60 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-accent">
          Admin
        </span>
        {isPending && (
          <Loader2 className="size-3.5 animate-spin text-muted-foreground" aria-hidden="true" />
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Set report status">
        {STATUSES.map((status) => {
          const active = status === issue.status
          return (
            <button
              key={status}
              type="button"
              onClick={() => setStatus(status)}
              disabled={isPending || active}
              aria-pressed={active}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed ${
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {SHORT_LABEL[status]}
            </button>
          )
        })}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        {confirming ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={remove}
              disabled={isPending}
              className="rounded-md bg-destructive px-2.5 py-1 text-xs font-semibold text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Confirm delete
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={isPending}
              className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            Delete
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  )
}
