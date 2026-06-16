import { ChevronLeft, FileSearch2 } from 'lucide-react'
import Link from 'next/link'

export const TenderNotFound = () => {
    return (
        <div className="bg-panel flex min-h-screen flex-col">
            {/* top bar */}
            <div className="bg-surface border-border flex h-[58px] shrink-0 items-center gap-4 border-b px-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-[13.5px] text-[#6b6a63] no-underline"
                >
                    <ChevronLeft size={16} strokeWidth={1.8} />
                    Tenders
                </Link>
                <div className="ml-auto flex items-center gap-2">
                    <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#d8d3c8] text-[11.5px] font-semibold text-muted">
                        KM
                    </div>
                </div>
            </div>

            {/* empty state */}
            <div className="flex flex-1 items-center justify-center px-6 py-16">
                <div className="w-full max-w-[560px] text-center">
                    <div className="bg-surface border-border mx-auto mb-[30px] flex h-[84px] w-[84px] items-center justify-center rounded-[20px] border">
                        <FileSearch2 size={38} strokeWidth={1.5} className="text-faint" />
                    </div>
                    <h1 className="font-serif mb-4 text-[42px] leading-[1.08] tracking-[-0.01em]">
                        This tender couldn&apos;t be found
                    </h1>
                    <div className="mt-8 flex items-center justify-center">
                        <Link
                            href="/"
                            className="bg-ink text-panel flex items-center gap-[9px] rounded-[9px] px-[18px] py-[11px] text-[13.5px] font-medium no-underline"
                        >
                            <ChevronLeft size={15} strokeWidth={1.9} />
                            Back to tenders list
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
