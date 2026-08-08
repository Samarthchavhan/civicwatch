import { neon } from '@neondatabase/serverless'

export const sql = neon(process.env.DATABASE_URL!)

export type IssueStatus = 'Pending' | 'Officially Filed' | 'Resolved'

export type Issue = {
  id: number
  description: string
  location: string
  issue_date: string
  photo_pathname: string | null
  status: IssueStatus
  created_at: string
}

export async function getIssues(): Promise<Issue[]> {
  const rows = await sql`
    SELECT id, description, location, issue_date, photo_pathname, status, created_at
    FROM issues
    ORDER BY created_at DESC
  `
  return rows as Issue[]
}
