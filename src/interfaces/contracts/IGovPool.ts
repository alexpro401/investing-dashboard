import { GovPool } from "interfaces/typechain"

export type IGovPoolWithdrawableAssets = Awaited<
  ReturnType<GovPool["getWithdrawableAssets"]>
>
