const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]

/** Compact money like the design: `12.4M PLN`, `640K PLN`, `1.2B PLN`. */
export const formatValue = (value: number | null, currency: string | null): string => {
    if (value == null) return '—'
    const cur = currency ?? ''
    const abs = Math.abs(value)

    let num: string
    if (abs >= 1_000_000_000) num = trim(value / 1_000_000_000) + 'B'
    else if (abs >= 1_000_000) num = trim(value / 1_000_000) + 'M'
    else if (abs >= 1_000) num = trim(value / 1_000) + 'K'
    else num = trim(value)

    return cur ? `${num} ${cur}` : num
}

const trim = (n: number): string => Number(n.toFixed(1)).toString()

/** `24 Jul 2026`, optionally `24 Jul 2026 · 10:00`. */
export const formatDeadline = (iso: string | null, withTime = false): string => {
    if (!iso) return '—'
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return '—'

    const day = String(d.getDate()).padStart(2, '0')
    const date = `${day} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
    if (!withTime) return date

    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    return `${date} · ${hh}:${mm}`
}

/** Mock tender reference derived from the id, since the DB has no ref field. */
export const tenderRef = (id: string): string => {
    const tail = id.replace(/-/g, '').slice(-5).toUpperCase()
    return `PL-2026-${tail}`
}
