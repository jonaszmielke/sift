import { fetchTender, TenderDetails } from '@/lib/api'
import { cache } from 'react'
import { notFound } from 'next/navigation'

export const getTender = cache(async (id: string): Promise<TenderDetails> => {
    try {
        const tender = await fetchTender(id)

        if (!tender) notFound()

        return tender
    } catch {
        notFound()
    }
})
