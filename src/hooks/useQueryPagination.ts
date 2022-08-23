import { useEffect, useState, useCallback } from "react"
import { useQuery } from "urql"
import debounce from "lodash.debounce"
import { usePrevious } from "react-use"

import { DEFAULT_PAGINATION_COUNT } from "constants/misc"

const useQueryPagination = (
  query,
  variables = {},
  prepareNewData: (d: any) => any,
  limit = DEFAULT_PAGINATION_COUNT,
  initialOffset = 0
): any => {
  const [result, setResult] = useState<any[]>([])
  const [offset, setOffset] = useState(initialOffset)

  const [{ fetching, data, error }] = useQuery({
    query,
    variables: { limit, offset, ...variables },
  })

  const prevFetching = usePrevious(fetching)

  useEffect(() => {
    if (
      ((prevFetching === true && fetching === false) ||
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
  }, [query, variables])

  // Change offset trigger useQuery hook to fetch new piese of data
  // using actual variables
  const fetchMore = useCallback(() => {
    setOffset(result.length)
  }, [result])

  // Clear state helper
  const reset = useCallback(() => {
    setOffset(0)
    setResult([])
  }, [])

  return [
    { data: result, error, loading: fetching },
    debounce(fetchMore, 100),
    reset,
  ]
}

export default useQueryPagination
