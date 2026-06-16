'use client'

import { Criterion } from './Criterion'
import { Fact } from './Fact'
import { FileCard } from './FileCard'
import { SectionLabel } from './SectionLabel'
import { ChatPanel } from '@/app/tenders/[id]/components/ChatPanel'
import { AnalyzedPill } from '@/components/StatusBadge'
import { TenderDetails } from '@/lib/api'
import { formatDeadline, formatValue, tenderRef } from '@/lib/format'
import { ChevronLeft, Download, Plus } from 'lucide-react'
import Link from 'next/link'

// TODO: Add better handling for not analized tenders
const Muted = () => <div className="text-faint text-[13.5px]">Not analyzed yet.</div>

const TenderDetailPageClient = ({ tender }: { tender: TenderDetails }) => {
    const title = tender.title ?? tender.name

    return (
        <div className="bg-panel flex h-screen flex-col">
            {/* top bar */}
            <div className="bg-surface border-border flex h-[58px] shrink-0 items-center gap-4 px-6 border-b">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-[13.5px] text-[#6b6a63] no-underline"
                >
                    <ChevronLeft size={16} strokeWidth={1.8} />
                    Tenders
                </Link>
                <div className="h-[18px] w-px bg-[#dad6cc]" />
                <div className="text-fainter font-mono text-[12px]">
                    TENDER · {tenderRef(tender.id)}
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <button className="border-line text-muted flex items-center gap-[7px] rounded-lg border px-3 py-[7px] text-[13px]">
                        <Download size={14} strokeWidth={1.8} />
                        Export brief
                    </button>
                    <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#d8d3c8] text-[11.5px] font-semibold text-muted">
                        KM
                    </div>
                </div>
            </div>

            {/* body */}
            <div className="flex min-h-0 flex-1">
                {/* left: details + files */}
                <div className="sift-scroll min-w-0 flex-1 overflow-y-auto px-[44px] py-9">
                    <div className="mb-[14px] flex items-center gap-[10px]">
                        <AnalyzedPill status={tender.status} />
                        <span className="text-[12.5px] text-[#9a988f]">
                            {tender.procuring_entity ?? 'Unknown entity'} · Roboty budowlane
                        </span>
                    </div>

                    <h2 className="font-serif mb-[26px] max-w-[600px] text-[38px] leading-[1.12] tracking-[-0.01em]">
                        {title}
                    </h2>

                    {/* fact grid */}
                    <div className="border-border mb-[30px] grid grid-cols-3 gap-px overflow-hidden rounded-xl border bg-border">
                        <Fact label="Value">
                            <span className="font-serif text-[18px]">
                                {formatValue(tender.value, null)}
                                {tender.currency && (
                                    <span className="ml-1 font-mono text-[13px] text-[#9a988f]">
                                        {tender.currency}
                                    </span>
                                )}
                            </span>
                        </Fact>
                        <Fact label="Deadline">
                            <span className="font-serif text-[18px]">
                                {formatDeadline(tender.deadline)}
                            </span>
                        </Fact>
                        <Fact label="Procuring entity">
                            <span className="mt-[3px] text-[15px] font-medium">
                                {tender.procuring_entity ?? '—'}
                            </span>
                        </Fact>
                    </div>

                    {/* subject */}
                    <div className="mb-7">
                        <SectionLabel>Subject</SectionLabel>
                        <p className="text-ink-soft m-0 max-w-[620px] text-[15px] leading-[1.65]">
                            {tender.subject_description ?? 'Not analyzed yet.'}
                        </p>
                    </div>

                    {/* eval + requirements */}
                    <div className="mb-[34px] grid grid-cols-2 gap-9">
                        <div>
                            <SectionLabel>Evaluation criteria</SectionLabel>
                            <div className="flex flex-col gap-3">
                                {(tender.evaluation_criteria ?? []).map((c, i) => (
                                    <Criterion key={i} text={c} />
                                ))}
                                {!tender.evaluation_criteria?.length && <Muted />}
                            </div>
                        </div>
                        <div>
                            <SectionLabel>Key requirements</SectionLabel>
                            <div className="flex flex-col gap-[11px] text-[13.5px] leading-[1.45]">
                                {(tender.key_requirements ?? []).map((r, i) => (
                                    <div key={i} className="flex gap-[9px]">
                                        <span>—</span>
                                        {r}
                                    </div>
                                ))}
                                {!tender.key_requirements?.length && <Muted />}
                            </div>
                        </div>
                    </div>

                    {/* files */}
                    <div className="border-border-soft mb-[13px] flex items-center justify-between border-t pt-6">
                        <SectionLabel className="mb-0">Files · {tender.files.length}</SectionLabel>
                        <button className="border-line flex items-center gap-[6px] rounded-lg border px-[11px] py-[6px] text-[13px]">
                            <Plus size={13} strokeWidth={2.2} />
                            Add file
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-[10px]">
                        {tender.files.map((f) => (
                            <FileCard key={f.id} file={f} />
                        ))}
                        {tender.files.length === 0 && (
                            <div className="text-faint col-span-2 text-[13px]">No files yet.</div>
                        )}
                    </div>
                </div>

                <ChatPanel />
            </div>
        </div>
    )
}

export default TenderDetailPageClient
