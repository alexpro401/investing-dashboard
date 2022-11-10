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
}

interface IPowers {
  power: BigNumber | undefined
  nftPower: BigNumber[] | undefined
  totalNftPower: BigNumber | undefined
  totalPower: BigNumber | undefined
}

const initialState = {
  power: undefined,
  nftPower: undefined,
  totalNftPower: undefined,
  totalPower: undefined,
}

const useGovPoolUserVotingPower = ({
  daoAddress,
  address,
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
        false,
        false
      )

      const totalNftPower = reduce(
        nftPower,
        (acc, nftPowerItem) => addBignumbers([acc, 18], [nftPowerItem, 18]),
        ZERO
      )

      const totalPower = addBignumbers([power, 18], [totalNftPower, 18])

      setResult({
        power,
        nftPower,
        totalNftPower,
        totalPower,
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
  }, [govUserKeeperContract, address])

  useEffect(() => {
    if (!govUserKeeperContract || !daoAddress || !address) {
      return
    }
    ;(async () => await getUserVotingPower())()
  }, [govUserKeeperContract, getUserVotingPower, daoAddress, address])

  return [result, loading]
}

export default useGovPoolUserVotingPower
