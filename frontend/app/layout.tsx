import type { Metadata } from 'next'
import { Fraunces, Geist, Geist_Mono, Newsreader } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/components/QueryProvider'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

const fraunces = Fraunces({
    variable: '--font-fraunces',
    weight: ['400', '500', '600'],
    subsets: ['latin'],
})

const newsreader = Newsreader({
    variable: '--font-newsreader',
    weight: ['400', '500'],
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'Sift',
    description: 'Sift through public tenders.',
}

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${newsreader.variable} h-full antialiased`}
        >
            <body className="bg-paper text-ink min-h-full">
                <QueryProvider>{children}</QueryProvider>
            </body>
        </html>
    )
}

export default RootLayout
