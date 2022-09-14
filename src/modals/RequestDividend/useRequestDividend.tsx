import { useWeb3React } from "@web3-react/core"
import {
  useERC20,
  useInvestPoolContract,
  useInvestProposalContract,
  useTraderPoolContract,
} from "hooks/useContract"
import {
  useActiveInvestmentsInfo,
  useInvestProposal,
  useRewards,
} from "hooks/useInvestmentProposals"
import { useInvestProposalClaims } from "hooks/useInvestProposalData"
import usePoolIcon from "hooks/usePoolIcon"
import { useCallback, useMemo } from "react"
import { useInvestProposalMetadata } from "state/ipfsMetadata/hooks"
import { useTransactionAdder } from "state/transactions/hooks"
import { TransactionType } from "state/transactions/types"
import { normalizeBigNumber } from "utils"

export interface DividendToken {
  icon: JSX.Element
  symbol?: string
  name?: string
}

interface Props {
  poolAddress: string
  proposalId: string
  onClose: () => void
}

const useRequestDividend = ({ poolAddress, proposalId, onClose }: Props) => {
  const { account } = useWeb3React()
  const addTransaction = useTransactionAdder()
  const [poolIcon, poolInfo] = usePoolIcon(poolAddress, 38)
  const [proposal] = useInvestProposal(poolAddress, proposalId)
  const traderPool = useTraderPoolContract(poolAddress)
  const investPool = useInvestPoolContract(poolAddress)
  const [, proposalAddress] = useInvestProposalContract(poolAddress)
  const rewards = useRewards({ poolAddress, proposalId, account })
  const [, baseData] = useERC20(poolInfo?.parameters.baseToken)
  const proposalInvestmentInfo = useActiveInvestmentsInfo(
    poolAddress,
    account,
    proposalId
  )
  const [{ investProposalMetadata }] = useInvestProposalMetadata(
    poolAddress,
    proposal?.proposalInfo.descriptionURL
  )
  const claims = useInvestProposalClaims({
    proposalAddress,
    proposalId,
    account,
  })

  const token: DividendToken = useMemo(() => {
    return {
      icon: poolIcon,
      symbol: investProposalMetadata?.ticker,
      name: poolInfo?.name,
    }
  }, [poolIcon, poolInfo, investProposalMetadata])

  const info = useMemo(() => {
    if (!proposal || !proposalInvestmentInfo || !baseData) return null

    return {
      baseSymbol: baseData.symbol,
      proposalSize: {
        account: normalizeBigNumber(proposalInvestmentInfo.baseInvested),
        total: normalizeBigNumber(proposal.proposalInfo.investedBase),
      },
      totalDividendsUSD: normalizeBigNumber(rewards?.totalUsdAmount, 18, 2),
      dividends: rewards?.rewards[0].tokens.map((token, index) => ({
        address: token,
        amount: rewards?.rewards[0].amounts[index],
      })),
    }
  }, [proposal, proposalInvestmentInfo, baseData, rewards])

  const handleSubmit = useCallback(async () => {
    if (!traderPool || !rewards || !investPool) return

    try {
      const invests = await traderPool.getInvestTokens(
        rewards.baseAmountFromRewards
      )

      const transactionResponse = await investPool.reinvestProposal(
        parseFloat(proposalId) + 1,
        invests.receivedAmounts
      )

      addTransaction(transactionResponse, {
        type: TransactionType.INVEST_PROPOSAL_CLAIM,
      })
      onClose()
    } catch (error) {
      console.log(error)
    }
  }, [traderPool, rewards, investPool, proposalId, addTransaction, onClose])

  return { token, info, handleSubmit, claims }
}

export default useRequestDividend
