import { useMemo } from "react"
import { isArray } from "lodash"
import { Interface } from "@ethersproject/abi"
import { BigNumber } from "@ethersproject/bignumber"

import { isAddress } from "utils"
import { GovUserKeeper as GovUserKeeper_ABI } from "abi"
import { useMultipleContractSingleData } from "state/multicall/hooks"

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

const USER_KEEPER_INTERFACE = new Interface(GovUserKeeper_ABI)

const useGovPoolVotingPowerMulticall = (
  params: IUseGovPoolUserVotingPower[],
  format = false
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
    if (format) {
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
                    memo.micropool[validatedAddresses[i]] = result
                  }

                  if (validatedParams[2][i]) {
                    memo.delegated[validatedAddresses[i]] = result
                  }

                  memo.default[validatedAddresses[i]] = result
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
    }

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
  }, [params, validatedParams, anyLoading, callResults, format])
}

export default useGovPoolVotingPowerMulticall
