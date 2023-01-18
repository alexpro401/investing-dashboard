import { useMemo, useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "urql"
import { BigNumber } from "@ethersproject/bignumber"

import { useActiveWeb3React } from "hooks"
import {
  useGovPoolPendingRewards,
  useGovPoolWithdrawableAssets,
} from "hooks/dao"
import {
  useERC20GovBalance,
  useERC721GovBalance,
} from "hooks/dao/useGovPoolMemberBalance"
import {
  GovMemberProposalsHistoryCountQuery,
  GovVoterInPoolQuery,
} from "queries"
import { isAddress } from "utils"
import { graphClientDaoPools } from "utils/graphClient"

interface IUseMyBalanceProps {
  startLoading: boolean
}

const useMyBalance = ({ startLoading }: IUseMyBalanceProps) => {
  const { daoAddress } = useParams<"daoAddress">()
  const { account } = useActiveWeb3React()
  const { pendingRewards } = useGovPoolPendingRewards(daoAddress)
  const [proposalsCount, setProposalsCount] = useState<number | null>(null)
  const [receivedRewardsUSD, setRecievedRewardsUSD] = useState<string | null>(
    null
  )
  const [unclaimedProposalsCount, setUnclaimedProposalsCount] = useState<
    number | null
  >(null)
  const [internalLoading, setInternalLoading] = useState<boolean>(true)

  const withdrawableAssets = useGovPoolWithdrawableAssets({
    daoPoolAddress: startLoading ? daoAddress : "",
    delegator: account,
  })

  const erc20Balances = useERC20GovBalance(startLoading ? daoAddress : "")
  const erc721Balances = useERC721GovBalance(startLoading ? daoAddress : "")

  const handleSetProposals = useCallback(
    async (proposalsData: { proposalId: string }[]) => {
      let pendingRewardsCount = 0
      setInternalLoading(true)

      for (const proposal of proposalsData) {
        try {
          const result = await pendingRewards({
            proposalId: proposal.proposalId,
            account: account ?? "",
          })

          if (result && "gt" in result && result.gt(BigNumber.from("0"))) {
            pendingRewardsCount++
          }
        } catch (error) {
          console.log(error)
        }
      }

      setUnclaimedProposalsCount(pendingRewardsCount)
      setInternalLoading(false)
    },
    [pendingRewards, account]
  )

  const [{ fetching: proposalsFetching, data: poposalsData }] = useQuery({
    query: GovMemberProposalsHistoryCountQuery,
    variables: useMemo(
      () => ({ address: daoAddress, voters: [account] }),
      [daoAddress, account]
    ),
    context: graphClientDaoPools,
    pause: useMemo(
      () => !startLoading || !isAddress(daoAddress) || !isAddress(account),
      [daoAddress, account, startLoading]
    ),
  })

  const [{ fetching: voterFetching, data: voterData }] = useQuery({
    query: GovVoterInPoolQuery,
    variables: useMemo(
      () => ({ pool: daoAddress, voter: account }),
      [daoAddress, account]
    ),
    context: graphClientDaoPools,
    pause: useMemo(
      () => !startLoading || !isAddress(daoAddress) || !isAddress(account),
      [daoAddress, account, startLoading]
    ),
  })

  useEffect(() => {
    if (poposalsData) {
      setProposalsCount(poposalsData?.proposals?.length ?? 0)
      handleSetProposals(poposalsData?.proposals ?? [])
    }
  }, [poposalsData, handleSetProposals])

  useEffect(() => {
    if (voterData) {
      setRecievedRewardsUSD(voterData?.voterInPools[0]?.totalClaimedUSD ?? "0")
    }
  }, [voterData])

  return {
    proposalsCount,
    receivedRewardsUSD,
    unclaimedProposalsCount,
    withdrawableAssets,
    erc20Balances,
    erc721Balances,
    loading: proposalsFetching || voterFetching || internalLoading || false,
  }
}

export default useMyBalance
