import { BigNumber } from "@ethersproject/bignumber"
import { useWeb3React } from "@web3-react/core"
import { IGovPoolWithdrawableAssets } from "interfaces/contracts/IGovPool"
import { useGovPoolContract } from "contracts"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useSingleContractMultipleData } from "state/multicall/hooks"
import { isAddress } from "utils"
import { ZERO, ZERO_ADDR } from "consts"

interface Params {
  delegator?: string | null
  delegatee?: string | null
}

interface Data {
  daoPoolAddress?: string
}

interface WithdrawableAssetsProps extends Data {
  params: Params[]
}

interface Response {
  tokens: BigNumber
  nfts: [tokens: BigNumber[], amount: BigNumber]
}

export const useGovPoolWithdrawableAssetsQuery = (
  props: WithdrawableAssetsProps
) => {
  const { daoPoolAddress, params } = props
  const { account } = useWeb3React()

  const validatedAssets = useMemo(
    () =>
      params
        .filter(({ delegator }) => isAddress(delegator) ?? [])
        .map(({ delegator, delegatee }) => [
          delegator!,
          delegatee || ZERO_ADDR,
        ]),
    [params]
  )

  const govPool = useGovPoolContract(daoPoolAddress)

  const callResults = useSingleContractMultipleData(
    govPool,
    "getWithdrawableAssets",
    validatedAssets
  )

  const assets: Response[] = useMemo(() => {
    const defaultParams = {
      tokens: ZERO,
      nfts: [[], ZERO],
    } as unknown as Response

    if (account && params.length > 0) {
      return params.map((result, i) => {
        try {
          const data = callResults[i]?.result || defaultParams
          return [data[0], data[1]] as unknown as Response
        } catch {}
        return defaultParams
      })
    }

    return []
  }, [account, params, callResults])

  return assets
}

const useGovPoolWithdrawableAssets = ({
  daoPoolAddress,
  delegator,
  delegatee = ZERO_ADDR,
}: Data & Params) => {
  const [withdrawableAssets, setWithdrawableAssets] =
    useState<IGovPoolWithdrawableAssets>()
  const govPool = useGovPoolContract(daoPoolAddress)

  const getWithdrawableAssets = useCallback(async () => {
    if (!govPool || !delegator || !delegatee) return

    try {
      const data = await govPool.getWithdrawableAssets(delegator, delegatee)

      setWithdrawableAssets(data)
    } catch (error) {
      console.error(error)
    }
  }, [delegatee, delegator, govPool])

  useEffect(() => {
    getWithdrawableAssets()
  }, [getWithdrawableAssets])

  return withdrawableAssets
}

export default useGovPoolWithdrawableAssets
