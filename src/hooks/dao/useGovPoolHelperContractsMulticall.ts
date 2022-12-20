import { Interface } from "@ethersproject/abi"
import { GovPool } from "abi"
import { IGovVotingPower } from "interfaces/contracts/IGovUserKeeper"
import { useMemo } from "react"
import { useMultipleContractSingleData } from "state/multicall/hooks"
import { isAddress } from "utils"

const GovPoolInterface = new Interface(GovPool)

const useGovPoolHelperContractsMulticall = (
  daoPoolAddresses: (string | undefined)[]
) => {
  const validatedAddresses = useMemo(() => {
    return daoPoolAddresses.filter((address) => isAddress(address))
  }, [daoPoolAddresses])

  const callResults = useMultipleContractSingleData(
    validatedAddresses,
    GovPoolInterface,
    "getHelperContracts",
    useMemo(() => undefined, [])
  )

  const anyLoading: boolean = useMemo(
    () => callResults.some((callState) => callState.loading),
    [callResults]
  )

  return useMemo(() => {
    return [
      validatedAddresses.length > 0
        ? validatedAddresses.reduce<{
            [address: string]: IGovVotingPower
          }>((memo, token, i) => {
            const value = callResults?.[i]?.result

            if (!value) return memo

            memo[token!] = value as unknown as IGovVotingPower

            return memo
          }, {})
        : {},
      anyLoading,
    ]
  }, [validatedAddresses, anyLoading, callResults])
}

export default useGovPoolHelperContractsMulticall
