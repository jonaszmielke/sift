'use client'

import useFetchMoreObserver from '@/hooks/useFetchMoreObserver'
import { fetchTenders } from '@/lib/api'
import { queryKeys } from '@/lib/queryKeys'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export const useTenders = () => {
    const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: [queryKeys.tendersList],
            queryFn: ({ pageParam }) => fetchTenders(pageParam),
            initialPageParam: undefined as string | undefined,
            getNextPageParam: (last) => last.next_cursor ?? undefined,
        })

    const tenders = useMemo(() => data?.pages.flatMap((p) => p.tenders) ?? [], [data])

    const { lastElementRef } = useFetchMoreObserver({
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    })

    return {
        tenders,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        lastElementRef,
    }
}
