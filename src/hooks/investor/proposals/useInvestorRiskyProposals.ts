import { useWeb3React } from "@web3-react/core"

import { WrappedRiskyProposalView } from "types"

import { useGetPoolsUserInvestedIn, useRiskyProposalsList } from "hooks"

type Response = [Array<WrappedRiskyProposalView>, boolean, () => void]

function useInvestorRiskyProposals(): Response {
  const { account } = useWeb3React()

  const [poolsUserInvestedIn, poolsUserInvestedInLoading] =
    useGetPoolsUserInvestedIn(account, "BASIC_POOL")

  return useRiskyProposalsList(poolsUserInvestedIn, poolsUserInvestedInLoading)
}

export default useInvestorRiskyProposals
