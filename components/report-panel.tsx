'use client'

import { useCallback, useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReportForm } from '@/components/report-form'
import { cn } from '@/lib/utils'

export function ReportPanel({
  variant = 'default',
  className,
  label = 'File a report',
}: {
  variant?: 'default' | 'hero'
  className?: string
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'gap-2 font-semibold',
          variant === 'hero' && 'h-11 px-6 text-base',
          className,
        )}
      >
        <Plus className="size-4" aria-hidden="true" />
        {label}
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="report-panel-title">
          <button
            type="button"
            aria-label="Close report panel"
            onClick={close}
            className="absolute inset-0 bg-background/70 backdrop-blur-sm animate-in fade-in"
          />
          <div className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-border bg-card shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 px-5 py-4 backdrop-blur">
              <div>
                <h2 id="report-panel-title" className="font-heading text-lg font-bold text-card-foreground">
                  File a new report
                </h2>
                <p className="text-xs text-muted-foreground">Photo, description, location, and date.</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="p-5">
              <ReportForm onSuccess={close} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
