import { useCallback, useEffect, useState } from "react"
import { useGovPool } from "hooks/dao"
import { WrappedProposalView } from "types"
import { isEqual } from "lodash"

export const useGovPoolProposals = (
  govPoolAddress?: string,
  _offset?: number,
  _limit?: number
) => {
  const { getProposals } = useGovPool(govPoolAddress)

  const [offset, setOffset] = useState(_offset || 0)
  const [limit, setLimit] = useState(_limit || 500)

  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoadFailed, setIsLoadFailed] = useState(false)

  const [wrappedProposalViews, setWrappedProposalViews] = useState<
    WrappedProposalView[]
  >([])

  const loadProposals = useCallback(async () => {
    try {
      const data = await getProposals(offset, limit)

      if (data) {
        setWrappedProposalViews((prev) => {
          const next = data.map(
            (el, idx) =>
              ({
                ...el,
                proposalId: offset + idx + 1,
              } as WrappedProposalView)
          )

          return isEqual(prev, next) ? prev : next
        })
      }
    } catch (error) {
      setIsLoadFailed(true)
    }
    setIsLoaded(true)
  }, [getProposals, limit, offset])

  useEffect(() => {
    loadProposals()
  }, [offset, limit, loadProposals])

  return {
    isLoaded,
    isLoadFailed,

    wrappedProposalViews,

    setOffset,
    setLimit,
  }
}
