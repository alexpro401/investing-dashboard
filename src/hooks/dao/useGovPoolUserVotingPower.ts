import { BigNumber } from "@ethersproject/bignumber"
import { useCallback, useEffect, useMemo, useState } from "react"

import { isAddress, parseTransactionError } from "utils"
import useError from "hooks/useError"
import { ZERO } from "constants/index"
import { useMultipleContractSingleData } from "state/multicall/hooks"
import { GovUserKeeper as GovUserKeeper_ABI } from "abi"
import { Interface } from "@ethersproject/abi"
import { isArray } from "lodash"
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

interface IUserVotingPowerMulticallResponse {
  default: {
    [address: string]: IVotingPowerResponse
  }
  micropool: {
    [address: string]: IVotingPowerResponse
  }
  delegated: {
    [address: string]: IVotingPowerResponse
  }
}

const initialState: IVotingPowerResponse = {
  power: ZERO,
  nftPower: ZERO,
  perNftPower: [],
  ownedBalance: ZERO,
  ownedLength: ZERO,
  nftIds: [],
}

const USER_KEEPER_INTERFACE = new Interface(GovUserKeeper_ABI)

export const useGovPoolVotingPowerMulticall = (
  params: IUseGovPoolUserVotingPower[]
): [data: IUserVotingPowerMulticallResponse, loading: boolean] => {
  const validatedList = useMemo(
    () =>
      params.filter(
        (p) => isAddress(p.address) && isAddress(p.userKeeperAddress)
      ),
    [params]
  )

  const validatedAddresses = useMemo(
    () => validatedList.map((p) => p.userKeeperAddress as string),
    [validatedList]
  )

  const validatedParams = useMemo(() => {
    const addresses = validatedList.map((p) => p.address as string)
    const isMicroPool = validatedList.map((p) => p.isMicroPool || false)
    const useDelegated = validatedList.map((p) => p.useDelegated || false)

    return [addresses, isMicroPool, useDelegated] as const
  }, [validatedList])

  const callResults = useMultipleContractSingleData(
    validatedAddresses,
    USER_KEEPER_INTERFACE,
    "votingPower",
    validatedParams as any
  )

  const anyLoading: boolean = useMemo(
    () => callResults.some((callState) => callState.loading),
    [callResults]
  )

  return useMemo(() => {
    return [
      validatedParams.length > 0
        ? validatedParams[0].reduce<IUserVotingPowerMulticallResponse>(
            (memo, account, i) => {
              const value = callResults?.[i]?.result?.[0]

              if (!value) return memo

              if (!isArray(value) || !value.length) return memo

              params.map((p, i) => {
                const {
                  power,
                  nftPower,
                  perNftPower,
                  ownedBalance,
                  ownedLength,
                  nftIds,
                } = value[i]

                const result = {
                  power,
                  nftPower,
                  perNftPower,
                  ownedBalance,
                  ownedLength,
                  nftIds,
                }

                if (validatedParams[1][i]) {
                  memo.micropool[account] = result
                }

                if (validatedParams[2][i]) {
                  memo.delegated[account] = result
                }

                memo.default[account] = result
              })

              return memo
            },
            {
              default: {},
              micropool: {},
              delegated: {},
            }
          )
        : {
            default: {},
            micropool: {},
            delegated: {},
          },
      anyLoading,
    ]
  }, [params, validatedParams, anyLoading, callResults])
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
