import { StatusBadge } from '@/components/StatusBadge'
import type { TenderListItem } from '@/lib/api'
import { formatDeadline, formatValue } from '@/lib/format'
import Link from 'next/link'

// No category field in the DB — deterministic mock subtitle so rows match the design.
const MOCK_CATEGORIES = [
    'Roboty budowlane · sektor wodno-kanalizacyjny',
    'Dostawy · sprzęt diagnostyczny',
    'Roboty budowlane · infrastruktura drogowa',
    'Usługi · system teleinformatyczny',
    'Roboty budowlane · efektywność energetyczna',
    'Dostawy · transport publiczny',
]

const mockCategory = (id: string): string => {
    let h = 0
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
    return MOCK_CATEGORIES[h % MOCK_CATEGORIES.length]
}

const GRID = 'grid grid-cols-[1fr_200px_128px_120px_118px] gap-4'

export const TenderRow = ({ tender }: { tender: TenderListItem }) => {
    return (
        <Link
            href={`/tenders/${tender.id}`}
            className={`${GRID} border-border-soft items-center border-b px-2 py-[17px] hover:bg-[#f4f1ea]`}
        >
            <div>
                <div className="font-news mb-[3px] text-[17px] font-medium leading-tight tracking-[-0.005em]">
                    {tender.name}
                </div>
                <div className="text-[12.5px] text-[#9a988f]">{mockCategory(tender.id)}</div>
            </div>
            <div className="text-muted text-[13.5px]">{tender.procuring_entity ?? '—'}</div>
            <div className="font-mono text-[13px]">
                {formatValue(tender.value, tender.currency)}
            </div>
            <div className="text-muted text-[13px]">{formatDeadline(tender.deadline)}</div>
            <StatusBadge status={tender.status} />
        </Link>
    )
}

export const TENDER_GRID = GRID
