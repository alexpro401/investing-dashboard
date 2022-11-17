import { useCallback, useEffect, useState } from "react"

import { useGovPoolContract } from "contracts"

const useGovPoolLatestProposalId = (daoPoolAddress: string | undefined) => {
  const govPoolContract = useGovPoolContract(daoPoolAddress)

  const [latestProposalId, setLatestProposalId] = useState<number | null>(null)

  const getLatestProposalId = useCallback(async () => {
    if (!govPoolContract) return

    try {
      const _latestProposalId = await govPoolContract.latestProposalId()
      setLatestProposalId(_latestProposalId.toNumber())

      return _latestProposalId
    } catch (error) {
      console.log(error)
      return
    }
  }, [govPoolContract])

  const updateLatesProposalId = useCallback(async () => {
    return getLatestProposalId()
  }, [getLatestProposalId])

  useEffect(() => {
    getLatestProposalId()
  }, [getLatestProposalId])

  return { updateLatesProposalId, latestProposalId }
}

export default useGovPoolLatestProposalId
