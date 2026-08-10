'use server'

import { put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { sql, type IssueStatus } from '@/lib/db'
import { ADMIN_COOKIE, adminToken, isAdmin, pinIsValid } from '@/lib/admin'

export type SubmitState = { ok: boolean; error?: string } | null
export type LoginState = { error?: string } | null
export type AdminActionResult = { ok: boolean; error?: string }

const VALID_STATUSES: IssueStatus[] = ['Pending', 'Officially Filed', 'Resolved']

export async function submitIssue(
  _prevState: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const description = String(formData.get('description') ?? '').trim()
  const location = String(formData.get('location') ?? '').trim()
  const issueDate = String(formData.get('issueDate') ?? '').trim()
  const photo = formData.get('photo')

  if (!description || !location || !issueDate) {
    return { ok: false, error: 'Description, location, and date are all required.' }
  }

  let photoPathname: string | null = null

  try {
    if (photo instanceof File && photo.size > 0) {
      if (!photo.type.startsWith('image/')) {
        return { ok: false, error: 'The uploaded file must be an image.' }
      }
      if (photo.size > 8 * 1024 * 1024) {
        return { ok: false, error: 'Photo must be smaller than 8MB.' }
      }
      const blob = await put(`issues/${Date.now()}-${photo.name}`, photo, {
        access: 'private',
        addRandomSuffix: true,
      })
      photoPathname = blob.pathname
    }

    await sql`
      INSERT INTO issues (description, location, issue_date, photo_pathname, status)
      VALUES (${description}, ${location}, ${issueDate}, ${photoPathname}, 'Pending')
    `
  } catch (error) {
    console.log('[v0] submitIssue error:', error)
    return { ok: false, error: 'Something went wrong while filing your report. Please try again.' }
  }

  revalidatePath('/')
  return { ok: true }
}

export async function adminLogin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const pin = String(formData.get('pin') ?? '')
  if (!pinIsValid(pin)) {
    return { error: 'Incorrect PIN. Please try again.' }
  }
  const store = await cookies()
  store.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  })
  redirect('/')
}

export async function adminLogout() {
  const store = await cookies()
  store.delete(ADMIN_COOKIE)
  redirect('/')
}

export async function updateIssueStatus(
  id: number,
  status: IssueStatus,
): Promise<AdminActionResult> {
  if (!(await isAdmin())) return { ok: false, error: 'Unauthorized' }
  if (!VALID_STATUSES.includes(status)) return { ok: false, error: 'Invalid status' }

  try {
    if (status === 'Resolved') {
      // Stamp resolved_at once so the average-resolution metric stays accurate.
      await sql`
        UPDATE issues
        SET status = ${status}, resolved_at = COALESCE(resolved_at, now())
        WHERE id = ${id}
      `
    } else {
      await sql`
        UPDATE issues
        SET status = ${status}, resolved_at = NULL
        WHERE id = ${id}
      `
    }
  } catch (error) {
    console.log('[v0] updateIssueStatus error:', error)
    return { ok: false, error: 'Could not update the report status.' }
  }

  revalidatePath('/')
  return { ok: true }
}

export async function deleteIssue(id: number): Promise<AdminActionResult> {
  if (!(await isAdmin())) return { ok: false, error: 'Unauthorized' }

  try {
    await sql`DELETE FROM issues WHERE id = ${id}`
  } catch (error) {
    console.log('[v0] deleteIssue error:', error)
    return { ok: false, error: 'Could not delete the report.' }
  }

  revalidatePath('/')
  return { ok: true }
}
export async function updateComplaintNo(
  id: number,
  complaintNo: string,
): Promise<AdminActionResult> {
  if (!(await isAdmin())) return { ok: false, error: 'Unauthorized' }

  try {
    await sql`
      UPDATE issues
      SET complaint_no = ${complaintNo.trim()}
      WHERE id = ${id}
    `
  } catch (error) {
    console.log('[v0] updateComplaintNo error:', error)
    return { ok: false, error: 'Could not update the complaint number.' }
  }

  revalidatePath('/')
  return { ok: true }
}