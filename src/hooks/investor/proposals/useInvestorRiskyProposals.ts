import { useWeb3React } from "@web3-react/core"

import { WrappedRiskyProposalView } from "types"

import { useGetPoolsUserInvestedIn, useRiskyProposalsByPools } from "hooks"

type Response = [Map<string, WrappedRiskyProposalView>, boolean, () => void]

function useInvestorRiskyProposals(): Response {
  const { account } = useWeb3React()

  /**
   * 1) Get pools user invested in
   *
   * investor can see risky proposals in any basic pool he invested in
   * that's why we need to get all basic pools user invested in
   *
   */
  const [poolsUserInvestedIn, poolsUserInvestedInLoading] =
    useGetPoolsUserInvestedIn(account, "BASIC_POOL")

  return useRiskyProposalsByPools(
    poolsUserInvestedIn,
    poolsUserInvestedInLoading
  )
}

export default useInvestorRiskyProposals
