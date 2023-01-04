import { useMemo } from "react"
import { Interface } from "@ethersproject/abi"
import { BigNumber } from "@ethersproject/bignumber"

import { isAddress } from "utils"
import { GovUserKeeper as GovUserKeeper_ABI } from "abi"
import { useMultipleContractSingleData } from "state/multicall/hooks"

interface IVotingPowerParams {
  address?: (string | null | undefined)[]
  isMicroPool?: boolean[]
  useDelegated?: boolean[]
}

interface Props {
  userKeeperAddresses: (string | null | undefined)[]
  params: IVotingPowerParams
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

const useGovPoolVotingPowerMulticall = ({
  userKeeperAddresses,
  params,
}: Props): [data: IUserVotingPowerMulticallResponse, loading: boolean] => {
  const validatedList = useMemo(
    () => userKeeperAddresses.filter((p) => isAddress(p)),
    [userKeeperAddresses]
  )

  const validatedAddresses = useMemo(
    () => validatedList.map((p) => p as string),
    [validatedList]
  )

  const validatedParams = useMemo(() => {
    return [
      params.address,
      params.isMicroPool || false,
      params.useDelegated || false,
    ] as unknown as [
      address: string[],
      isMicroPool: boolean[],
      useDelegated: boolean[]
    ]
  }, [params.address, params.isMicroPool, params.useDelegated])

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
      validatedAddresses.length > 0
        ? validatedAddresses.reduce(
            (memo, address, i) => {
              const value = callResults?.[i]?.result?.[0]

              if (!value) return memo

              validatedParams[0].map((_, i) => {
                const {
                  nftIds,
                  nftPower,
                  ownedBalance,
                  ownedLength,
                  perNftPower,
                  power,
                } = value[i]

                const data = {
                  nftIds,
                  nftPower,
                  ownedBalance,
                  ownedLength,
                  perNftPower,
                  power,
                }

                if (validatedParams[1][i]) {
                  memo.micropool[address as string] = data
                }

                if (validatedParams[2][i]) {
                  memo.delegated[address as string] = data
                }

                memo.default[address as string] = data
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
  }, [validatedParams, anyLoading, callResults, validatedAddresses])
}

export default useGovPoolVotingPowerMulticall
