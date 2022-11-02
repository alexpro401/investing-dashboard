import { Multicall } from "interfaces/typechain"

export type ITryBlockAndAggregate = Awaited<
  ReturnType<Multicall["tryBlockAndAggregate"]>
>
