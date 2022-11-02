import { TraderPool } from "interfaces/typechain"

export type ITraderPoolExchangeAmount = Awaited<
  ReturnType<TraderPool["getExchangeAmount"]>
>

export type IPoolInfo = Awaited<ReturnType<TraderPool["getPoolInfo"]>>

export type ILeverageInfo = Awaited<ReturnType<TraderPool["getLeverageInfo"]>>

export type IUserFeeInfo = Awaited<ReturnType<TraderPool["getUsersInfo"]>>

export type IInvestTokens = Awaited<ReturnType<TraderPool["getInvestTokens"]>>

export type IDivestAmountsAndCommissions = Awaited<
  ReturnType<TraderPool["getDivestAmountsAndCommissions"]>
>
