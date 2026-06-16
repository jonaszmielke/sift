'use client'

import { ChatPanel } from '@/app/tenders/[id]/components/ChatPanel'
import { AnalyzedPill } from '@/components/StatusBadge'
import { TenderNotFound } from '@/components/TenderNotFound'
import { ApiError, fetchTender, type FileSummary } from '@/lib/api'
import { formatDeadline, formatValue, tenderRef } from '@/lib/format'
import { queryKeys } from '@/lib/queryKeys'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, Download, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const TenderDetailPage = () => {
    const params = useParams<{ id: string }>()
    const id = params.id

    const { data, isLoading, error } = useQuery({
        queryKey: [queryKeys.tenderDetails, id],
        queryFn: () => fetchTender(id),
        retry: (_count, err) => !(err instanceof ApiError && err.status === 404),
    })

    if (error instanceof ApiError && error.status === 404) {
        return <TenderNotFound />
    }

    if (isLoading || !data) {
        return (
            <div className="bg-panel flex min-h-screen items-center justify-center">
                <span className="inline-block h-[18px] w-[18px] animate-spin rounded-full border-2 border-[#d6d2c8] border-t-faint" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-panel text-faint flex min-h-screen items-center justify-center text-[14px]">
                Couldn&apos;t load this tender.
            </div>
        )
    }

    const t = data
    const title = t.title ?? t.name

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
                <div className="text-fainter font-mono text-[12px]">TENDER · {tenderRef(t.id)}</div>
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
                        <AnalyzedPill status={t.status} />
                        <span className="text-[12.5px] text-[#9a988f]">
                            {t.procuring_entity ?? 'Unknown entity'} · Roboty budowlane
                        </span>
                    </div>

                    <h2 className="font-serif mb-[26px] max-w-[600px] text-[38px] leading-[1.12] tracking-[-0.01em]">
                        {title}
                    </h2>

                    {/* fact grid */}
                    <div className="border-border mb-[30px] grid grid-cols-3 gap-px overflow-hidden rounded-xl border bg-border">
                        <Fact label="Value">
                            <span className="font-serif text-[18px]">
                                {formatValue(t.value, null)}
                                {t.currency && (
                                    <span className="ml-1 font-mono text-[13px] text-[#9a988f]">
                                        {t.currency}
                                    </span>
                                )}
                            </span>
                        </Fact>
                        <Fact label="Deadline">
                            <span className="font-serif text-[18px]">
                                {formatDeadline(t.deadline)}
                            </span>
                        </Fact>
                        <Fact label="Procuring entity">
                            <span className="mt-[3px] text-[15px] font-medium">
                                {t.procuring_entity ?? '—'}
                            </span>
                        </Fact>
                    </div>

                    {/* subject */}
                    <div className="mb-7">
                        <SectionLabel>Subject</SectionLabel>
                        <p className="text-ink-soft m-0 max-w-[620px] text-[15px] leading-[1.65]">
                            {t.subject_description ?? 'Not analyzed yet.'}
                        </p>
                    </div>

                    {/* eval + requirements */}
                    <div className="mb-[34px] grid grid-cols-2 gap-9">
                        <div>
                            <SectionLabel>Evaluation criteria</SectionLabel>
                            <div className="flex flex-col gap-3">
                                {(t.evaluation_criteria ?? []).map((c, i) => (
                                    <Criterion key={i} text={c} />
                                ))}
                                {!t.evaluation_criteria?.length && <Muted />}
                            </div>
                        </div>
                        <div>
                            <SectionLabel>Key requirements</SectionLabel>
                            <div className="flex flex-col gap-[11px] text-[13.5px] leading-[1.45]">
                                {(t.key_requirements ?? []).map((r, i) => (
                                    <div key={i} className="flex gap-[9px]">
                                        <span>—</span>
                                        {r}
                                    </div>
                                ))}
                                {!t.key_requirements?.length && <Muted />}
                            </div>
                        </div>
                    </div>

                    {/* files */}
                    <div className="border-border-soft mb-[13px] flex items-center justify-between border-t pt-6">
                        <SectionLabel className="mb-0">Files · {t.files.length}</SectionLabel>
                        <button className="border-line flex items-center gap-[6px] rounded-lg border px-[11px] py-[6px] text-[13px]">
                            <Plus size={13} strokeWidth={2.2} />
                            Add file
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-[10px]">
                        {t.files.map((f) => (
                            <FileCard key={f.id} file={f} />
                        ))}
                        {t.files.length === 0 && (
                            <div className="text-faint col-span-2 text-[13px]">No files yet.</div>
                        )}
                    </div>
                </div>

                {/* right: chat */}
                <ChatPanel />
            </div>
        </div>
    )
}

export default TenderDetailPage

const SectionLabel = ({
    children,
    className = '',
}: {
    children: React.ReactNode
    className?: string
}) => {
    return (
        <div
            className={`text-fainter mb-[10px] font-mono text-[11px] uppercase tracking-[0.08em] ${className}`}
        >
            {children}
        </div>
    )
}

const Fact = ({ label, children }: { label: string; children: React.ReactNode }) => {
    return (
        <div className="bg-panel px-[18px] py-4">
            <div className="text-fainter mb-[7px] font-mono text-[10px] uppercase tracking-[0.08em]">
                {label}
            </div>
            {children}
        </div>
    )
}

const Muted = () => <div className="text-faint text-[13.5px]">Not analyzed yet.</div>

// Eval criteria are plain strings; pull a trailing percentage for the bar when present.
const Criterion = ({ text }: { text: string }) => {
    const match = text.match(/(\d+)\s*%/)
    const pct = match ? Number(match[1]) : null
    const label = match
        ? text
              .replace(match[0], '')
              .replace(/[—–-]\s*$/, '')
              .trim()
        : text

    return (
        <div>
            <div className="mb-[5px] flex justify-between text-[13.5px]">
                <span>{label}</span>
                {pct != null && <span className="font-mono">{pct}%</span>}
            </div>
            {pct != null && (
                <div className="border-border-soft h-[5px] overflow-hidden rounded-[3px] bg-border-soft">
                    <div className="bg-ink h-full" style={{ width: `${pct}%` }} />
                </div>
            )}
        </div>
    )
}

const FILE_COLORS: Record<string, string> = {
    pdf: '#c2453b',
    doc: '#2b6cb0',
    docx: '#2b6cb0',
    xls: '#2f855a',
    xlsx: '#2f855a',
}

const FileCard = ({ file }: { file: FileSummary }) => {
    const ext = file.filename.split('.').pop()?.toLowerCase() ?? ''
    const color = FILE_COLORS[ext] ?? '#8a8880'
    const tag = ext.startsWith('xls') ? 'XLS' : ext.startsWith('doc') ? 'DOC' : 'PDF'

    return (
        <div className="flex items-center gap-[11px] rounded-[11px] border border-[#e8e4db] bg-white px-[13px] py-3 hover:border-line">
            <div
                className="border-border flex h-[34px] w-[28px] items-end justify-center rounded bg-panel pb-1 font-mono text-[8px]"
                style={{ color }}
            >
                {tag}
            </div>
            <div className="min-w-0 flex-1">
                <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium">
                    {file.filename}
                </div>
            </div>
            <X size={14} strokeWidth={1.8} className="text-[#b8b5ab]" />
        </div>
    )
}
