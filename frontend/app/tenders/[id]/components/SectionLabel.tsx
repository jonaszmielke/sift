export const SectionLabel = ({
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
