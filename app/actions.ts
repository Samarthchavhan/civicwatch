'use server'

import { put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'
import { sql } from '@/lib/db'

export type SubmitState = { ok: boolean; error?: string } | null

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
