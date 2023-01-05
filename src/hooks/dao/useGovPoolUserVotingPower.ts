import { BigNumber } from "@ethersproject/bignumber"
import { useCallback, useEffect, useState } from "react"

import { parseTransactionError } from "utils"
import useError from "hooks/useError"
import { ZERO } from "consts"
import { GovUserKeeper as GovUserKeeper_ABI } from "abi"
import useContract from "hooks/useContract"
import { GovUserKeeper } from "interfaces/typechain"

interface IUseGovPoolUserVotingPower {
  userKeeperAddress?: string
  address?: string | null
  isMicroPool?: boolean
  useDelegated?: boolean
}

interface IVotingPowerResponse {
  power: BigNumber
  nftPower: BigNumber
  perNftPower: BigNumber[]
  ownedBalance: BigNumber
  ownedLength: BigNumber
  nftIds: BigNumber[]
}

const initialState: IVotingPowerResponse = {
  power: ZERO,
  nftPower: ZERO,
  perNftPower: [],
  ownedBalance: ZERO,
  ownedLength: ZERO,
  nftIds: [],
}

const useGovPoolUserVotingPower = ({
  userKeeperAddress,
  address,
  isMicroPool,
  useDelegated,
}: IUseGovPoolUserVotingPower): [
  result: IVotingPowerResponse,
  loading: boolean
] => {
  const [, setError] = useError()
  const govUserKeeperContract = useContract<GovUserKeeper>(
    userKeeperAddress,
    GovUserKeeper_ABI,
    true
  )

  const [result, setResult] = useState<IVotingPowerResponse>(initialState)
  const [loading, setLoading] = useState<boolean>(true)

  const getUserVotingPower = useCallback(async () => {
    if (!govUserKeeperContract || !address) return

    try {
      setLoading(true)

      const [
        { power, nftPower, perNftPower, ownedBalance, ownedLength, nftIds },
      ] = await govUserKeeperContract.votingPower(
        [address],
        [isMicroPool || false],
        [useDelegated || false]
      )

      setResult({
        power,
        nftPower,
        perNftPower,
        ownedBalance,
        ownedLength,
        nftIds,
      })
    } catch (error: any) {
      if (!!error && !!error.data && !!error.data.message) {
        setError(error.data.message)
      } else {
        const errorMessage = parseTransactionError(error.toString())
        !!errorMessage && setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }, [govUserKeeperContract, address, isMicroPool, useDelegated, setError])

  useEffect(() => {
    if (!govUserKeeperContract || !userKeeperAddress || !address) {
      return
    }
    ;(async () => await getUserVotingPower())()
  }, [govUserKeeperContract, getUserVotingPower, userKeeperAddress, address])

  return [result, loading]
}

export default useGovPoolUserVotingPower
