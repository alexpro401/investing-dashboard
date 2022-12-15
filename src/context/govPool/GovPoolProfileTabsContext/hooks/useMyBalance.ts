import { useMemo, useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import { createClient, useQuery } from "urql"
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
} from "queries/gov-pools"
import { isAddress } from "utils"

const daoGraphClient = createClient({
  url: process.env.REACT_APP_DAO_POOLS_API_URL || "",
  requestPolicy: "network-only",
})

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

          if (result && result.gt(BigNumber.from("0"))) {
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
    context: daoGraphClient,
    pause: useMemo(
      () => !startLoading || !isAddress(daoAddress) || !isAddress(account),
      [daoAddress, account, startLoading]
    ),
    requestPolicy: "network-only",
  })

  const [{ fetching: voterFetching, data: voterData }] = useQuery({
    query: GovVoterInPoolQuery,
    variables: useMemo(
      () => ({ pool: daoAddress, voter: account }),
      [daoAddress, account]
    ),
    context: daoGraphClient,
    pause: useMemo(
      () => !startLoading || !isAddress(daoAddress) || !isAddress(account),
      [daoAddress, account, startLoading]
    ),
    requestPolicy: "network-only",
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
