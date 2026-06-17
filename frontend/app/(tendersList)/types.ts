import { TenderStatus } from '@/lib/api'

export const StatusFilterOptions = {
    ALL: 'all',
    PENDING: TenderStatus.PENDING,
    ANALYZED: TenderStatus.ANALYZED,
} as const

export type StatusFilterOptions = (typeof StatusFilterOptions)[keyof typeof StatusFilterOptions]
