'use client'

import { useTransition } from 'react'
import { Loader2, LogOut, ShieldCheck } from 'lucide-react'
import { adminLogout } from '@/app/actions'

export function AdminBar() {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="sticky top-0 z-50 border-b border-accent/30 bg-accent/10 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <span className="flex items-center gap-2 text-xs font-semibold text-accent">
          <ShieldCheck className="size-4" aria-hidden="true" />
          Admin mode — status and delete controls are live on every report.
        </span>
        <button
          type="button"
          onClick={() => startTransition(() => adminLogout())}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-md border border-accent/40 px-2.5 py-1 text-xs font-semibold text-accent transition-colors hover:bg-accent/15 disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <LogOut className="size-3.5" aria-hidden="true" />
          )}
          Sign out
        </button>
      </div>
    </div>
  )
}
