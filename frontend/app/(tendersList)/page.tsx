import TendersListPageClient from './components/TendersPageClient'
import { Metadata } from 'next'

export const generateMetadata = (): Metadata => {
    return {
        title: `Tenders · Sift`,
    }
}

const TendersListPage = () => {
    return <TendersListPageClient />
}

export default TendersListPage
