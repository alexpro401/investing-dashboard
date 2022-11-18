import { TransactionType } from "state/transactions/types"

import CardSwap from "./CardSwap"
import CardLiquidity from "./CardLiquidity"
import { Transaction } from "interfaces/thegraphs/interactions"

interface IProps {
  payload: Transaction
  chainId?: number
}

const TransactionHistoryCard: React.FC<IProps> = ({ payload, chainId }) => {
  switch (Number(payload.type[0])) {
    case TransactionType.SWAP:
      return (
        <CardSwap
          hash={payload.id}
          info={payload.exchange[0]}
          chainId={chainId}
          timestamp={payload.timestamp}
        />
      )
    case TransactionType.INVEST:
    case TransactionType.DIVEST:
      return (
        <CardLiquidity
          hash={payload.id}
          info={payload.vest[0]}
          chainId={chainId}
          timestamp={payload.timestamp}
          isInvest={payload.type.includes(String(TransactionType.INVEST))}
        />
      )
    default:
      return null
  }
}

export default TransactionHistoryCard
