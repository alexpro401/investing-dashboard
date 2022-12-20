import { GovUserKeeper } from "interfaces/typechain"

export type IGovTokenBalance = Awaited<
  ReturnType<GovUserKeeper["tokenBalance"]>
>
export type IGovNftBalance = Awaited<ReturnType<GovUserKeeper["nftBalance"]>>
export type IGovNftExactBalance = Awaited<
  ReturnType<GovUserKeeper["nftExactBalance"]>
>

export type IGovDelegations = Awaited<ReturnType<GovUserKeeper["delegations"]>>

export type IGovVotingPower = Awaited<ReturnType<GovUserKeeper["votingPower"]>>
