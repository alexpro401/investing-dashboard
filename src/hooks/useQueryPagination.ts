import { useEffect, useState, useCallback } from "react"
import { useQuery } from "urql"
import { debounce } from "lodash"
import { usePrevious } from "react-use"

import useError from "hooks/useError"
import { DEFAULT_PAGINATION_COUNT } from "constants/misc"

const useQueryPagination = (
  query,
  variables,
  pause,
  prepareNewData: (d: any) => any,
  limit = DEFAULT_PAGINATION_COUNT,
  initialOffset = 0
): any => {
  const [, setError] = useError()
  const [offset, setOffset] = useState(initialOffset)
  const [result, setResult] = useState<any[]>([])

  const [{ fetching, data, error }] = useQuery({
    query,
    pause,
    variables: { limit, offset, ...(variables ?? {}) },
    requestPolicy: "network-only", // disable "urql" library cache
  })

  const prevFetching = usePrevious(fetching)

  // Change offset trigger useQuery hook to fetch new piece of data using actual variables
  const fetchMore = useCallback(() => {
    setOffset(result.length)
  }, [result])

  // Clear state helper
  const reset = useCallback(() => {
    setOffset(0)
    setResult([])
  }, [])

  useEffect(() => {
    if (
      ((prevFetching === true && !fetching) ||
        (data !== undefined && prevFetching === undefined)) &&
      !error
    ) {
      const newPieceOfData = prepareNewData(data)
      if (newPieceOfData.length > 0) {
        setResult((d) => [...d, ...newPieceOfData])
      }
    }
  }, [fetching, data, error, prepareNewData, offset, prevFetching])

  // Clear state when query or variables changed
  useEffect(() => {
    reset()
  }, [query, variables, reset])

  // Clear error state
  useEffect(() => {
    return () => setError("")
  }, [setError])

  // Set error
  useEffect(() => {
    if (!fetching && !!variables && error && error.message) {
      setError(error.message)
    }
  }, [fetching, variables, error, setError])

  return [
    { data: result, error, loading: fetching },
    debounce(fetchMore, 100),
    reset,
  ]
}

export default useQueryPagination
