import { toTime } from './stats'

const nf = new Intl.NumberFormat('en-US')
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const fill = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m))

export const num = (n: number) => nf.format(n)
export const pct = (p: number, digits = 0) => `${(p * 100).toFixed(digits)}%`

const parts = (d: string) => {
  const dt = new Date(toTime(d))
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth(), d: dt.getUTCDate(), wd: dt.getUTCDay() }
}
/** Nov 14, 2026 */
export const date = (d: string) => {
  const p = parts(d)
  return `${MONTHS[p.m]} ${p.d}, ${p.y}`
}
/** Nov 14 */
export const dayMonth = (d: string) => {
  const p = parts(d)
  return `${MONTHS[p.m]} ${p.d}`
}
/** Sat, Nov 14 */
export const weekdayDate = (d: string) => {
  const p = parts(d)
  return `${WEEKDAYS[p.wd]}, ${MONTHS[p.m]} ${p.d}`
}
/** May 2025 */
export const monthYear = (d: string) => {
  const p = parts(d.length === 7 ? `${d}-01` : d)
  return `${MONTHS_LONG[p.m]} ${p.y}`
}
export const monthShort = (key: string) => MONTHS[Number(key.slice(5, 7)) - 1]

/** "3 hours ago", "2 days ago" */
export function ago(iso: string, now = Date.now()) {
  const s = Math.max(0, Math.round((now - Date.parse(iso)) / 1000))
  const units: [number, string][] = [
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ]
  for (const [secs, name] of units) {
    const v = Math.floor(s / secs)
    if (v >= 1) return `${v} ${name}${v > 1 ? 's' : ''} ago`
  }
  return 'just now'
}
