'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { KeyRound, Loader2 } from 'lucide-react'
import { adminLogin, type LoginState } from '@/app/actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      Unlock admin controls
    </button>
  )
}

export function AdminLogin() {
  const [state, formAction] = useActionState<LoginState, FormData>(adminLogin, null)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="pin" className="text-sm font-medium text-foreground">
          Admin PIN
        </label>
        <input
          id="pin"
          name="pin"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          required
          placeholder="Enter your secure PIN"
          className="h-11 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
        />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <SubmitButton />

      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <KeyRound className="size-3.5" aria-hidden="true" />
        Only staff with the PIN can manage reports.
      </p>
    </form>
  )
}
