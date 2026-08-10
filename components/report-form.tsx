'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { ImagePlus, Loader2, MapPin, Send, X } from 'lucide-react'
import { submitIssue, type SubmitState } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full gap-2 font-semibold">
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Filing report…
        </>
      ) : (
        <>
          <Send className="size-4" aria-hidden="true" />
          Submit Report
        </>
      )}
    </Button>
  )
}

const inputClass =
  'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40'

const labelClass = 'text-sm font-semibold text-foreground'

export function ReportForm({ onSuccess }: { onSuccess?: () => void }) {
  const [state, formAction] = useActionState<SubmitState, FormData>(submitIssue, null)
  const formRef = useRef<HTMLFormElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset()
      setPreview(null)
      const timer = setTimeout(() => onSuccess?.(), 1200)
      return () => clearTimeout(timer)
    }
  }, [state, onSuccess])

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (preview) URL.revokeObjectURL(preview)
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  function clearPhoto() {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className={labelClass}>Photo of the issue</span>
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'group relative flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-dashed border-input bg-muted/40 px-4 py-6 text-center transition-colors hover:border-ring hover:bg-muted',
            preview && 'border-solid p-0 min-h-0',
          )}
        >
          {preview ? (
            <div className="relative w-full h-56">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview of the issue you are reporting" className="h-full w-full object-cover" />
            </div>
          ) : (
            <>
              <ImagePlus className="size-7 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">Tap to add a photo</span>
              <span className="text-xs text-muted-foreground">JPG or PNG, up to 8MB</span>
            </>
          )}
          <input
            ref={fileInputRef}
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={onFileChange}
          />
        </div>
        {preview && (
          <button
            type="button"
            onClick={clearPhoto}
            className="inline-flex w-fit items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" aria-hidden="true" />
            Remove photo
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          placeholder="Describe the issue — size, depth, and any hazard it poses."
          className={cn(inputClass, 'resize-none leading-relaxed')}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="location" className={labelClass}>
          Exact location
        </label>
        <div className="relative">
          <MapPin
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="location"
            name="location"
            required
            placeholder="e.g. Nandivali, Talav Road, Kalyan East"
            className={cn(inputClass, 'pl-9')}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="issueDate" className={labelClass}>
          Date observed
        </label>
        <input
          id="issueDate"
          name="issueDate"
          type="date"
          required
          max={today}
          defaultValue={today}
          className={inputClass}
        />
      </div>

      {state?.error && (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p
          role="status"
          className="rounded-md border border-status-resolved-foreground/20 bg-status-resolved px-3 py-2 text-sm font-medium text-status-resolved-foreground"
        >
          Report submitted. It&apos;s now Pending review by your local authority.
        </p>
      )}

      <SubmitButton />
    </form>
  )
}