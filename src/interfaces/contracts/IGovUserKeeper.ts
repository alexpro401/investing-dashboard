import { GovUserKeeper } from "interfaces/typechain"

export type IGovNftInfo = Awaited<ReturnType<GovUserKeeper["nftInfo"]>>
export type IGovTokenBalance = Awaited<
  ReturnType<GovUserKeeper["tokenBalance"]>
>
export type IGovNftBalance = Awaited<ReturnType<GovUserKeeper["nftBalance"]>>
export type IGovNftExactBalance = Awaited<
  ReturnType<GovUserKeeper["nftExactBalance"]>
>

export type IGovNftDelegations = Awaited<
  ReturnType<GovUserKeeper["delegations"]>
>
