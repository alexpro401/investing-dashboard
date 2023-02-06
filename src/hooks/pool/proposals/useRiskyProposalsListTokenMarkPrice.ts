import * as React from "react"
import { isEmpty } from "lodash"
import { BigNumber } from "@ethersproject/bignumber"
import { parseUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"

import { ZERO } from "consts"
import { RiskyProposalUtilityIds } from "types"
import {
  getRefreshIntervalByChain,
  OptionalMethodInputs,
  useSingleContractMultipleData,
} from "state/multicall/hooks"
import { usePriceFeedContract } from "contracts"
import { isAddress } from "utils"

type UtilityMap = Array<RiskyProposalUtilityIds>
type ProposalsMap = Record<string, BigNumber>

function useRiskyProposalsListTokenMarkPrice(
  proposalUtilityIdList: UtilityMap
): [ProposalsMap, boolean] {
  const { chainId } = useWeb3React()
  const priceFeed = usePriceFeedContract()

  const validatedTokenAddresses: string[] = React.useMemo(() => {
    const validList = proposalUtilityIdList
      .filter((t) => isAddress(t.proposalTokenAddress))
      .map((t) => t.proposalTokenAddress)

    return [...new Set(validList)]
  }, [proposalUtilityIdList])

  const callInputs = React.useMemo(() => {
    if (isEmpty(validatedTokenAddresses)) {
      return []
    }
    return validatedTokenAddresses.map((proposalTokenAddress) => [
      proposalTokenAddress,
      parseUnits("1", 18).toHexString(),
    ]) as unknown as OptionalMethodInputs[]
  }, [validatedTokenAddresses])

  const callResults = useSingleContractMultipleData(
    priceFeed,
    "getNormalizedPriceOutUSD",
    callInputs,
    {
      blocksPerFetch: getRefreshIntervalByChain(chainId, 1),
    }
  )

  const anyLoading = React.useMemo(
    () => callResults.some((callRes) => callRes.loading),
    [callResults]
  )

  const data = React.useMemo(
    () =>
      validatedTokenAddresses.reduce((memo, validatedTokenAddress, index) => {
        memo[validatedTokenAddress] =
          callResults?.[index].result?.amountOut ?? ZERO
        return memo
      }, {}),
    [callResults, validatedTokenAddresses]
  )

  return [data, anyLoading]
}

export default useRiskyProposalsListTokenMarkPrice
