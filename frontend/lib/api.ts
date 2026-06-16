export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export enum TenderStatus {
    PENDING = 'pending',
    ANALYZED = 'analyzed',
}

export type TenderListItem = {
    id: string
    name: string
    status: TenderStatus
    value: number | null
    currency: string | null
    deadline: string | null
    procuring_entity: string | null
}

export type TenderListResponse = {
    tenders: TenderListItem[]
    next_cursor: string | null
}

export type FileSummary = {
    id: string
    filename: string
}

export type TenderDetails = {
    id: string
    name: string
    status: TenderStatus
    title: string | null
    deadline: string | null
    value: number | null
    currency: string | null
    procuring_entity: string | null
    subject_description: string | null
    evaluation_criteria: string[] | null
    key_requirements: string[] | null
    analyzed_at: string | null
    created_at: string
    files: FileSummary[]
}

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

const request = async <T>(path: string): Promise<T> => {
    const res = await fetch(`${API_URL}${path}`)
    if (!res.ok) {
        throw new ApiError(res.status, `Request failed: ${res.status}`)
    }
    return res.json() as Promise<T>
}

export const fetchTenders = (lastId?: string | null): Promise<TenderListResponse> => {
    const qs = lastId ? `?lastId=${encodeURIComponent(lastId)}` : ''
    return request<TenderListResponse>(`/tenders${qs}`)
}

export const fetchTender = (id: string): Promise<TenderDetails> =>
    request<TenderDetails>(`/tender/${encodeURIComponent(id)}`)
