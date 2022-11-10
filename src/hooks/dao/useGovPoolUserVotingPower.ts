import { useCallback, useEffect, useState } from "react"
import { BigNumber } from "@ethersproject/bignumber"
import { isEmpty, reduce } from "lodash"

import { useGovUserKeeperContract } from "contracts"
import { addBignumbers } from "utils/formulas"
import { parseTransactionError } from "utils"
import useError from "hooks/useError"

interface IUseGovPoolUserVotingPower {
  daoAddress: string
  address?: string | null
}

interface IPowers {
  power: BigNumber | undefined
  nftPower: BigNumber[] | undefined
  total: BigNumber | undefined
}

const initialState = {
  power: undefined,
  nftPower: undefined,
  total: undefined,
}

function calculateTotalPower(
  power: BigNumber,
  nftPower: BigNumber[]
): BigNumber {
  if (!isEmpty(nftPower)) return power

  return reduce(
    nftPower,
    (acc, nftPowerItem) => addBignumbers([acc, 18], [nftPowerItem, 18]),
    power
  )
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

      const total = calculateTotalPower(power, nftPower)

      setResult({
        power,
        nftPower,
        total,
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
