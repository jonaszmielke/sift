export const Criterion = ({ text }: { text: string }) => {
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
