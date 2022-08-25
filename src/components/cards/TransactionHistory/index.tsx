import { ITokenBase } from "constants/interfaces"
import { TransactionType } from "state/transactions/types"

import CardSwap from "./CardSwap"
import CardLiquidity from "./CardLiquidity"

interface IProps {
  payload: any
  chainId?: number
  tokensData: { [n: string]: ITokenBase } | null
}

const TransactionHistoryCard: React.FC<IProps> = ({
  payload,
  chainId,
  tokensData,
}) => {
  if (!tokensData) return null
  switch (Number(payload.type[0])) {
    case TransactionType.SWAP:
      return (
        <CardSwap
          hash={payload.id}
          info={payload.exchange[0]}
          chainId={chainId}
          timestamp={payload.timestamp}
          toToken={tokensData[payload.exchange[0]?.toToken]}
          fromToken={tokensData[payload.exchange[0]?.fromToken]}
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
          baseToken={tokensData[payload.vest[0]?.pool]}
        />
      )
    default:
      return null
  }
}

export default TransactionHistoryCard
