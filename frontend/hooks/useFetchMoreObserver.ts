'use client'

import { useCallback, useRef } from 'react'

type UseFetchMoreObserverProps = {
    isFetchingNextPage: boolean
    fetchNextPage: () => void
    hasNextPage: boolean
}

const useFetchMoreObserver = ({
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
}: UseFetchMoreObserverProps) => {
    const observer = useRef<IntersectionObserver>(null)
    const lastElementRef = useCallback(
        (node: HTMLElement | null) => {
            if (isFetchingNextPage) return
            if (observer.current) observer.current.disconnect()
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage()
                }
            })
            if (node) observer.current.observe(node)
        },
        [isFetchingNextPage, fetchNextPage, hasNextPage]
    )

    return { lastElementRef }
}

export default useFetchMoreObserver
