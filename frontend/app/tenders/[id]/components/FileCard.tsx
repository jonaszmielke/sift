import { FileSummary } from '@/lib/api'
import { X } from 'lucide-react'

const FILE_COLORS: Record<string, string> = {
    pdf: '#c2453b',
    doc: '#2b6cb0',
    docx: '#2b6cb0',
    xls: '#2f855a',
    xlsx: '#2f855a',
}

export const FileCard = ({ file }: { file: FileSummary }) => {
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
