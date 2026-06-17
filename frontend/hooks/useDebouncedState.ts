import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export const useDebouncedState = <T>(
    initialValue: T,
    delayMs: number,
): [T, T, Dispatch<SetStateAction<T>>] => {
    const [value, setValue] = useState<T>(initialValue)
    const [debouncedValue, setDebouncedValue] = useState<T>(initialValue)

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedValue(value), delayMs)
        return () => clearTimeout(timeout)
    }, [value, delayMs])

    return [value, debouncedValue, setValue]
}
