import type { TenderStatus } from '@/lib/api'

/** Row-style status: small dot + label (filled for analyzed, outline for pending). */
export const StatusBadge = ({ status }: { status: TenderStatus }) => {
    if (status === 'analyzed') {
        return (
            <span className="flex items-center justify-end gap-[7px]">
                <span className="bg-ink h-[7px] w-[7px] rounded-full" />
                <span className="text-[12.5px]">Analyzed</span>
            </span>
        )
    }
    return (
        <span className="flex items-center justify-end gap-[7px]">
            <span className="h-[7px] w-[7px] rounded-full border-[1.5px] border-[#b8b5ab]" />
            <span className="text-faint text-[12.5px]">Pending</span>
        </span>
    )
}

/** Detail-style dark pill with a green dot. */
export const AnalyzedPill = ({ status }: { status: TenderStatus }) => {
    return (
        <span className="bg-ink text-panel flex items-center gap-[6px] rounded-md px-[9px] py-[4px] text-[11.5px]">
            <span
                className={`h-[5px] w-[5px] rounded-full ${status === 'analyzed' ? 'bg-dot-ok' : 'bg-[#b8b5ab]'}`}
            />
            {status === 'analyzed' ? 'Analyzed' : 'Pending'}
        </span>
    )
}
