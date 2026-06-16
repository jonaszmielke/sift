export const Fact = ({ label, children }: { label: string; children: React.ReactNode }) => {
    return (
        <div className="bg-panel px-[18px] py-4">
            <div className="text-fainter mb-[7px] font-mono text-[10px] uppercase tracking-[0.08em]">
                {label}
            </div>
            {children}
        </div>
    )
}
