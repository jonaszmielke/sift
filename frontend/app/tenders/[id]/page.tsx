import { getTender } from './actions/getTender'
import TenderDetailPageClient from './components/TenderPageClient'
import { Metadata } from 'next'

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ id: string }>
}): Promise<Metadata> => {
    const { id } = await params

    const tender = await getTender(id)

    return {
        title: `${tender.name} · Sift`,
    }
}

const TenderDetailPage = async ({ params }: { params: { id: string } }) => {
    const { id } = await params

    const tender = await getTender(id)

    return <TenderDetailPageClient tender={tender} />
}

export default TenderDetailPage
