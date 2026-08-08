import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { isAdmin } from '@/lib/admin'
import { AdminLogin } from '@/components/admin-login'
import { AdminBar } from '@/components/admin-bar'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const admin = await isAdmin()

  return (
    <div className="min-h-screen">
      {admin && <AdminBar />}

      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to CivicWatch
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="size-5.5" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-heading text-2xl font-bold tracking-tight text-foreground">
            {admin ? 'You are signed in' : 'Admin access'}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {admin
              ? 'Status and delete controls are unlocked on every report. Head back to the feed to manage submissions.'
              : 'Enter your PIN to unlock status management and moderation controls on the public feed.'}
          </p>

          <div className="mt-6">
            {admin ? (
              <Link
                href="/"
                className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Go to the feed
              </Link>
            ) : (
              <AdminLogin />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
