import { useEffect, useState, useCallback } from "react"
import { useQuery } from "urql"
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
      const [newPieceOfData] = prepareNewData(data)
      if (newPieceOfData.length > 0) {
        setResult((d) => [...d, ...newPieceOfData])
      }
    }
  }, [fetching, data, error, prepareNewData, offset, prevFetching])

  useEffect(() => {
    setResult([])
    setOffset(initialOffset)
  }, [query, variables, initialOffset])

  const fetchMore = useCallback(() => {
    setOffset(result.length)
  }, [result])

  return [{ data: result, error, loading: fetching }, fetchMore]
}

export default useQueryPagination
