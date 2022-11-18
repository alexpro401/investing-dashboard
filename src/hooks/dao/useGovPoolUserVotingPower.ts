import { useCallback, useEffect, useState } from "react"
import { BigNumber } from "@ethersproject/bignumber"
import { reduce } from "lodash"

import { useGovUserKeeperContract } from "contracts"
import { addBignumbers } from "utils/formulas"
import { parseTransactionError } from "utils"
import useError from "hooks/useError"
import { ZERO } from "constants/index"

interface IUseGovPoolUserVotingPower {
  daoAddress: string
  address?: string | null
  isMicroPool?: boolean
  useDelegated?: boolean
}

interface IPowers {
  power: BigNumber
  nftPower: BigNumber[]
  totalNftPower: BigNumber
}

const initialState = {
  power: ZERO,
  totalNftPower: ZERO,
  nftPower: [],
}

const useGovPoolUserVotingPower = ({
  daoAddress,
  address,
  isMicroPool,
  useDelegated,
}: IUseGovPoolUserVotingPower): [result: IPowers, loading: boolean] => {
  const [, setError] = useError()
  const govUserKeeperContract = useGovUserKeeperContract(daoAddress)

  const [result, setResult] = useState<IPowers>(initialState)
  const [loading, setLoading] = useState<boolean>(true)

  const getUserVotingPower = useCallback(async () => {
    if (!govUserKeeperContract || !address) return

    try {
      setLoading(true)

      const { power, nftPower } = await govUserKeeperContract.votingPower(
        address,
        isMicroPool || false,
        useDelegated || false
      )

      const totalNftPower = reduce(
        nftPower,
        (acc, nftPowerItem) => addBignumbers([acc, 18], [nftPowerItem, 18]),
        ZERO
      )

      setResult({
        power,
        nftPower,
        totalNftPower,
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
    if (!govUserKeeperContract || !daoAddress || !address) {
      return
    }
    ;(async () => await getUserVotingPower())()
  }, [govUserKeeperContract, getUserVotingPower, daoAddress, address])

  return [result, loading]
}

export default useGovPoolUserVotingPower
