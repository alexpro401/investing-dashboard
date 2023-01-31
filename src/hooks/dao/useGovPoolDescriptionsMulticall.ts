import { Interface } from "@ethersproject/abi"
import { GovPool } from "abi"
import { useEffect, useMemo, useState } from "react"
import { useMultipleContractSingleData } from "state/multicall/hooks"
import { isAddress } from "utils"
import { IGovPoolDescription } from "types"
import { isEmpty } from "lodash"
import { IpfsEntity } from "utils/ipfsEntity"

const GovPoolInterface = new Interface(GovPool)

const useGovPoolDescriptionsMulticall = (
  daoPoolAddresses: (string | undefined)[]
): [Record<string, IGovPoolDescription>, boolean] => {
  const [loading, setLoading] = useState(true)
  const validatedAddresses = useMemo(() => {
    return daoPoolAddresses.filter((address) => isAddress(address))
  }, [daoPoolAddresses])

  const callResults = useMultipleContractSingleData(
    validatedAddresses,
    GovPoolInterface,
    "descriptionURL",
    useMemo(() => undefined, [])
  )

  const anyLoading: boolean = useMemo(
    () => callResults.some((callState) => callState.loading),
    [callResults]
  )

  const poolToDescriptionURLMap = useMemo(
    () =>
      validatedAddresses.length > 0
        ? validatedAddresses.reduce<{
            [address: string]: string
          }>((memo, token, i) => {
            const value = callResults?.[i]?.result?.[0]

            memo[token!] = value as unknown as string

            return memo
          }, {})
        : {},

    [validatedAddresses, callResults]
  )

  const [descriptions, setDescriptions] = useState<
    Record<string, IGovPoolDescription>
  >({})

  useEffect(() => {
    if (anyLoading || isEmpty(poolToDescriptionURLMap)) return
    ;(async () => {
      const _result = {}

      for (const [address, path] of Object.entries(poolToDescriptionURLMap)) {
        if (isEmpty(path)) {
          _result[address] = null
          continue
        }

        const daoPoolIpfsEntity = new IpfsEntity<IGovPoolDescription>({
          path: path,
        })

        _result[address] = await daoPoolIpfsEntity.load()
      }
      setDescriptions(_result)
      setLoading(false)
    })()
  }, [anyLoading, poolToDescriptionURLMap])

  return [descriptions, loading || anyLoading]
}

export default useGovPoolDescriptionsMulticall
