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
  complaint_no: string | null
  created_at: string
  resolved_at: string | null
}

export type Stats = {
  total: number
  pending: number
  filed: number
  resolved: number
  avgResolutionDays: number | null
}

export async function getIssues(): Promise<Issue[]> {
  const rows = await sql`
    SELECT id, description, location, issue_date, photo_pathname, status, complaint_no, created_at, resolved_at
    FROM issues
    ORDER BY created_at DESC
  `
  return rows as Issue[]
}

export async function getStats(): Promise<Stats> {
  const rows = await sql`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'Pending')::int AS pending,
      COUNT(*) FILTER (WHERE status = 'Officially Filed')::int AS filed,
      COUNT(*) FILTER (WHERE status = 'Resolved')::int AS resolved,
      AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 86400.0)
        FILTER (WHERE status = 'Resolved' AND resolved_at IS NOT NULL) AS avg_resolution_days
    FROM issues
  `
  const row = rows[0] as {
    total: number
    pending: number
    filed: number
    resolved: number
    avg_resolution_days: number | null
  }

  return {
    total: row.total,
    pending: row.pending,
    filed: row.filed,
    resolved: row.resolved,
    avgResolutionDays:
      row.avg_resolution_days == null ? null : Math.round(Number(row.avg_resolution_days) * 10) / 10,
  }
}