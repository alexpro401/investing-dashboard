import { useEffect, useState, useCallback, useMemo } from "react"
import { CombinedError, useQuery } from "urql"
import { debounce } from "lodash"
import { usePrevious } from "react-use"
import { UseQueryArgs } from "urql/dist/types/hooks/useQuery"

import useError from "hooks/useError"
import { DEFAULT_PAGINATION_COUNT } from "constants/misc"

type Result<T> = [
  { data: T[]; error?: CombinedError; loading: boolean },
  () => void,
  () => void
]

interface QueryArgs<T> extends UseQueryArgs {
  formatter: (d: any) => T[]
}

interface PaginationArgs {
  limit: number
  initialOffset: number
}

const paginationDefault: PaginationArgs = {
  limit: DEFAULT_PAGINATION_COUNT,
  initialOffset: 0,
}

const useQueryPagination = <T>(
  { formatter, variables, ...queryArgs }: QueryArgs<T>,
  pagination = paginationDefault
): Result<T> => {
  const [, setError] = useError()
  const [offset, setOffset] = useState(pagination.initialOffset)
  const [result, setResult] = useState<T[]>([])

  const _variables = useMemo(
    () => ({
      ...variables,
      limit: pagination.limit,
      offset,
    }),
    [variables, offset, pagination]
  )

  const [{ fetching, data, error }] = useQuery({
    ...queryArgs,
    variables: _variables,
    requestPolicy: "network-only",
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
      const newPieceOfData = formatter(data)
      if (newPieceOfData.length > 0) {
        setResult((d) => [...d, ...newPieceOfData])
      }
    }
  }, [fetching, data, error, formatter, offset, prevFetching])

  // Clear state when query or variables changed
  useEffect(() => {
    reset()
  }, [queryArgs.query, variables, reset])

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
