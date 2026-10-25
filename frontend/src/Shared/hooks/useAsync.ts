import { useEffect, useRef, useState } from 'react'

interface AsyncState<T> {
  data: T | undefined
  loading: boolean
  error: unknown
}

export function useAsync<T>(loader: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: undefined, loading: true, error: null })
  const loaderRef = useRef(loader)
  loaderRef.current = loader
  const key = JSON.stringify(deps)

  useEffect(() => {
    let active = true
    setState((s) => ({ ...s, loading: true }))
    loaderRef
      .current()
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((error) => active && setState({ data: undefined, loading: false, error }))
    return () => {
      active = false
    }
  }, [key])

  return state
}
