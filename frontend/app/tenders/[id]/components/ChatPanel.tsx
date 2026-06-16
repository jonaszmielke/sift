'use client'

import { ArrowRight, Filter, MessagesSquare, Plus } from 'lucide-react'

type ChatMessage = {
    role: 'user' | 'assistant'
    text: string
    source?: string
}

// Mock conversation (chat logic handled later).
const CONVERSATION_TITLE = 'ELIGIBILITY CHECK'
const CONVERSATION_COUNT = 3
const MESSAGES: ChatMessage[] = [
    { role: 'user', text: 'Summarise the must-have requirements for this tender.' },
    {
        role: 'assistant',
        text: 'Four hard gates: 3 reference plants ≥ 50 000 PE, insurance ≥ 10M PLN, a licensed sanitary site manager, and a bid bond of 250 000 PLN by 24 Jul.',
        source: 'Source · SIWZ §7, p. 16-19',
    },
    { role: 'user', text: 'Which of those might we fail?' },
    {
        role: 'assistant',
        text: 'Likely the references — you have 2 of 3 qualifying. The rest you clear comfortably.',
    },
]

const SiftAvatar = () => {
    return (
        <div className="bg-ink flex h-[18px] w-[18px] items-center justify-center rounded-[5px]">
            <Filter size={10} className="text-panel" fill="currentColor" strokeWidth={0} />
        </div>
    )
}

export const ChatPanel = () => {
    return (
        <div className="bg-surface-soft border-border flex w-[400px] shrink-0 flex-col border-l">
            {/* header */}
            <div className="border-border flex items-center justify-between border-b px-5 py-4">
                <div className="flex items-center gap-[10px]">
                    <button
                        type="button"
                        aria-label="Conversations"
                        // Opens the conversation-list popup — wired once chat logic lands.
                        onClick={() => {}}
                        className="border-line hover:bg-[#f1eee6] flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-lg border"
                    >
                        <MessagesSquare size={15} strokeWidth={1.8} className="text-muted" />
                    </button>
                    <div>
                        <div className="mb-px text-[14px] font-semibold">Ask Sift</div>
                        <div className="text-fainter text-[11.5px]">
                            {CONVERSATION_COUNT} conversations
                        </div>
                    </div>
                </div>
                <button className="bg-ink text-panel flex cursor-pointer items-center gap-[6px] rounded-lg px-[11px] py-[6px] text-[12.5px]">
                    <Plus size={13} strokeWidth={2.2} />
                    New chat
                </button>
            </div>

            {/* messages */}
            <div className="sift-scroll flex flex-1 flex-col gap-4 overflow-y-auto p-5">
                <div className="text-fainter text-center font-mono text-[11px]">
                    {CONVERSATION_TITLE}
                </div>
                {MESSAGES.map((m, i) =>
                    m.role === 'user' ? (
                        <div
                            key={i}
                            className="bg-ink text-panel max-w-[82%] self-end rounded-[14px_14px_4px_14px] px-[13px] py-[10px] text-[13.5px] leading-normal"
                        >
                            {m.text}
                        </div>
                    ) : (
                        <div key={i} className="max-w-[90%] self-start">
                            <div className="mb-[6px] flex items-center gap-[7px]">
                                <SiftAvatar />
                                <span className="text-fainter font-mono text-[11px]">Sift</span>
                            </div>
                            <div className="text-ink-soft rounded-[14px_14px_14px_4px] border border-[#eae6dd] bg-white px-[13px] py-[11px] text-[13.5px] leading-[1.55]">
                                {m.text}
                            </div>
                            {m.source && (
                                <div className="mt-[6px] pl-[2px] text-[11px] text-[#b0aea4]">
                                    {m.source}
                                </div>
                            )}
                        </div>
                    )
                )}
            </div>

            {/* input (mock) */}
            <div className="border-border border-t px-[18px] py-[14px]">
                <div className="flex items-center gap-[10px] rounded-[11px] border border-[#e0dcd2] bg-white px-[14px] py-[11px]">
                    <span className="text-fainter flex-1 text-[13.5px]">
                        Ask about this tender…
                    </span>
                    <div className="bg-ink flex h-[28px] w-[28px] items-center justify-center rounded-lg">
                        <ArrowRight size={15} className="text-panel" strokeWidth={2} />
                    </div>
                </div>
            </div>
        </div>
    )
}
