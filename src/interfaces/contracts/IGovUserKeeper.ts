import { GovUserKeeper } from "interfaces/typechain"

export type IGovNftInfo = Awaited<ReturnType<GovUserKeeper["nftInfo"]>>
