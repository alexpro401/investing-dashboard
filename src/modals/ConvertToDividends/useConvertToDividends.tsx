import { useWeb3React } from "@web3-react/core"
import { useTraderPoolInvestProposalContract } from "contracts"
import { useInvestProposal } from "hooks/useInvestmentProposals"
import { usePoolContract } from "hooks/usePool"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useTransactionAdder } from "state/transactions/hooks"
import { TransactionType } from "state/transactions/types"
import { getTokenData, normalizeBigNumber } from "utils"

interface Balance {
  amount: string
  address: string
  symbol: string
}

const useConvertToDividends = (
  { poolAddress, proposalId },
  onClose
): [Balance | undefined, () => void] => {
  const { library, account } = useWeb3React()
  const investProposal = useTraderPoolInvestProposalContract(poolAddress)
  const [proposal] = useInvestProposal(poolAddress, proposalId)
  const [, poolInfo] = usePoolContract(poolAddress)
  const addTransaction = useTransactionAdder()

  const [symbol, setSymbol] = useState("")

  const handleConvertToDividends = useCallback(async () => {
    if (!investProposal) return

    const response = await investProposal.convertInvestedBaseToDividends(
      parseFloat(proposalId) + 1
    )

    addTransaction(response, {
      type: TransactionType.INVEST_PROPOSAL_CONVERT_TO_DIVIDENDS,
    })
    onClose()
  }, [addTransaction, investProposal, proposalId, onClose])

  useEffect(() => {
    if (!poolInfo) return
    ;(async () => {
      const data = await getTokenData(
        account,
        poolInfo.parameters.baseToken,
        library
      )

      setSymbol(data.symbol)
    })()
  }, [poolInfo, library, account])

  const info = useMemo(() => {
    if (!poolInfo || !proposal || !symbol) return

    return {
      amount: normalizeBigNumber(proposal.proposalInfo.newInvestedBase),
      address: poolInfo.parameters.baseToken,
      symbol,
    }
  }, [poolInfo, proposal, symbol])

  return [info, handleConvertToDividends]
}

export default useConvertToDividends
