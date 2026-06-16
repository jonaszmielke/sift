'use client'

import { useTenders } from './hooks/useTenders'
import { EmptyTenders } from '@/app/(tendersList)/components/EmptyTenders'
import { TENDER_GRID, TenderRow } from '@/app/(tendersList)/components/TenderRow'
import { AppSidebar } from '@/components/AppSidebar'
import { TenderStatus } from '@/lib/api'
import { Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

enum StatusFilterOptions {
    ALL = 'all',
    PENDING = TenderStatus.PENDING,
    ANALYZED = TenderStatus.ANALYZED,
}

const TendersPage = () => {
    const [statusFilter, setStatusFilter] = useState<StatusFilterOptions>(StatusFilterOptions.ALL)
    const [search, setSearch] = useState('')

    const { tenders, isLoading, isError, isFetchingNextPage, lastElementRef } = useTenders()

    const rows = useMemo(() => {
        const q = search.trim().toLowerCase()
        return tenders.filter((t) => {
            if (
                statusFilter !== StatusFilterOptions.ALL &&
                String(t.status) !== String(statusFilter)
            )
                return false
            if (q && !t.name.toLowerCase().includes(q)) return false
            return true
        })
    }, [tenders, statusFilter, search])

    const showEmpty = !isLoading && !isError && tenders.length === 0

    return (
        <div className="flex h-screen">
            <AppSidebar />

            <main className="bg-panel sift-scroll flex-1 overflow-y-auto">
                <div className="px-[38px] pt-[34px] pb-10">
                    {/* header */}
                    <div className="mb-[26px] flex items-end justify-between">
                        <h1 className="font-serif text-[40px] leading-none">Tenders</h1>
                        <button className="border-ink hover:bg-ink hover:text-panel flex cursor-pointer items-center gap-[9px] rounded-[9px] border px-[15px] py-[9px] text-[13.5px] font-medium">
                            <Plus size={15} strokeWidth={2} />
                            New tender
                        </button>
                    </div>

                    {/* toolbar */}
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-[18px]">
                        <div className="border-border text-faint flex min-w-[240px] max-w-[380px] flex-1 items-center gap-[10px] border-b-[1.5px] px-[2px] py-2">
                            <Search size={17} strokeWidth={1.8} />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search tenders by name…"
                                className="text-ink placeholder:text-faint flex-1 bg-transparent text-[14px] outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-[22px] text-[13.5px]">
                            {Object.values(StatusFilterOptions).map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setStatusFilter(filter)}
                                    className={`cursor-pointer pb-[3px] capitalize ${
                                        statusFilter === filter
                                            ? 'border-ink border-b-[1.5px] font-medium'
                                            : 'text-faint'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* column head */}
                    <div
                        className={`${TENDER_GRID} border-border text-fainter border-b px-2 pt-[14px] pb-[11px] font-mono text-[10.5px] uppercase tracking-widest`}
                    >
                        <div>Tender</div>
                        <div>Procuring entity</div>
                        <div>Value</div>
                        <div>Deadline</div>
                        <div className="text-right">Status</div>
                    </div>

                    {/* body */}
                    {showEmpty ? (
                        <EmptyTenders />
                    ) : isError ? (
                        <div className="text-faint py-16 text-center text-[13.5px]">
                            Couldn&apos;t load tenders. Is the API running?
                        </div>
                    ) : (
                        <div>
                            {rows.map((t) => (
                                <TenderRow key={t.id} tender={t} />
                            ))}

                            {(isLoading || isFetchingNextPage) && (
                                <div className="text-fainter flex items-center justify-center gap-[9px] p-[22px] font-mono text-[12.5px]">
                                    <span className="inline-block h-[13px] w-[13px] animate-spin rounded-full border-[1.6px] border-[#d6d2c8] border-t-faint" />
                                    Loading more tenders…
                                </div>
                            )}

                            <div ref={lastElementRef} className="h-px" />
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default TendersPage
