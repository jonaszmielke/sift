import { FilePlus2, Plus } from 'lucide-react'

export const EmptyTenders = () => {
    return (
        <div className="flex flex-col items-center px-6 pt-[72px] pb-16 text-center">
            <div className="bg-surface border-border text-fainter mb-[22px] flex h-[56px] w-[56px] items-center justify-center rounded-[14px] border">
                <FilePlus2 size={26} strokeWidth={1.6} />
            </div>
            <h3 className="font-serif mb-[10px] text-[28px] leading-[1.1]">Add your first tender</h3>
            <p className="text-faint mb-6 max-w-[380px] text-[14px] leading-[1.6]">
                Your tenders will live here. Add one to start, or set up your company profile and
                we&apos;ll surface matching public tenders automatically.
            </p>
            <div className="flex items-center gap-[10px]">
                <button className="border-border text-muted hover:border-ink cursor-pointer rounded-[9px] border px-[15px] py-[9px] text-[13.5px]">
                    Set up profile
                </button>
                <button className="bg-ink text-panel flex cursor-pointer items-center gap-2 rounded-[9px] px-4 py-[10px] text-[13.5px] font-medium">
                    <Plus size={15} strokeWidth={2} />
                    Add tender
                </button>
            </div>
        </div>
    )
}
