import { TransactionType } from "state/transactions/types"

import CardSwap from "./CardSwap"
import CardLiquidity from "./CardLiquidity"

interface IProps {
  payload: any
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
        />
      )
    default:
      return null
  }
}

export default TransactionHistoryCard
