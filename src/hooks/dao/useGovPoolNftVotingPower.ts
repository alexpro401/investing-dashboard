import { useCallback, useEffect, useState } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import { useGovUserKeeperContract } from "contracts"

type IUseGovPoolNftVotingPowerResult = [
  BigNumber | undefined,
  BigNumber[] | undefined,
  boolean
]

const useGovPoolNftVotingPower = (
  govPoolAddress: string | undefined,
  nftIds: string[]
): IUseGovPoolNftVotingPowerResult => {
  const userKeeperContract = useGovUserKeeperContract(govPoolAddress)
  const [nftPower, setNftPower] = useState<BigNumber | undefined>(undefined)
  const [perNftPower, setPerNftPower] = useState<BigNumber[] | undefined>(
    undefined
  )
  const [loading, setLoading] = useState<boolean>(true)

  const getNftsVotingPower = useCallback(async () => {
    if (!userKeeperContract) return

    if (nftIds.length === 0) {
      setLoading(false)
      setNftPower(BigNumber.from("0"))
      setPerNftPower([])
      return
    }

    try {
      setLoading(true)
      const result = await userKeeperContract.nftVotingPower(nftIds)
      setNftPower(result.nftPower)
      setPerNftPower(result.perNftPower)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [userKeeperContract, nftIds])

  useEffect(() => {
    getNftsVotingPower()
  }, [getNftsVotingPower])

  return [nftPower, perNftPower, loading]
}

export default useGovPoolNftVotingPower
