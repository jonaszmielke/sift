import { Calendar, ListFilter } from 'lucide-react'

export const AppSidebar = () => {
    return (
        <aside className="bg-surface border-border flex w-[228px] shrink-0 flex-col border-r px-[18px] py-6">
            {/* logo */}
            <div className="flex items-center gap-[9px] px-[6px] pb-[26px]">
                <div className="bg-ink text-panel font-serif flex h-[26px] w-[26px] items-center justify-center rounded-[7px] text-[18px]">
                    S
                </div>
                <div className="font-serif text-[23px] tracking-[0.01em]">Sift</div>
            </div>

            {/* nav */}
            <nav className="flex flex-col gap-[2px]">
                <a className="bg-ink text-panel flex items-center gap-[11px] rounded-lg px-[11px] py-[9px] text-[14px] font-medium">
                    <ListFilter size={17} strokeWidth={1.8} />
                    Tenders
                </a>
                <a className="text-[#6b6a63] hover:bg-[#f1eee6] flex cursor-pointer items-center gap-[11px] rounded-lg px-[11px] py-[9px] text-[14px]">
                    <Calendar size={17} strokeWidth={1.8} />
                    Calendar
                </a>
            </nav>

            {/* user chip */}
            <div className="border-border mt-auto flex items-center gap-[10px] border-t px-[6px] pt-[18px]">
                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#d8d3c8] text-[12px] font-semibold text-muted">
                    TU
                </div>
                <div className="leading-tight">
                    <div className="text-[13px] font-medium">Test user</div>
                    <div className="text-faint text-[11.5px]">Test company</div>
                </div>
            </div>
        </aside>
    )
}
