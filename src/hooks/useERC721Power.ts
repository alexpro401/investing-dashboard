import { useGovPoolVotingAssets } from "hooks/dao"
import { BigNumberish } from "@ethersproject/bignumber"
import { ZERO } from "consts"
import { useERC721Contract } from "contracts"
import { useEffect, useState } from "react"
import { divideBignumbers } from "utils/formulas"

interface PropsBase {
  daoPoolAddress?: string
}

interface Props extends PropsBase {
  tokenIds: BigNumberish[]
}

// TODO: get power of NFTs list using multicall hook
export const useERC721Power = ({ daoPoolAddress, tokenIds }: Props) => {
  const [power, setPower] = useState(ZERO)

  const [{ nftAddress }, { nftInfo }] = useGovPoolVotingAssets(daoPoolAddress)
  const nftCollection = useERC721Contract(nftAddress)

  useEffect(() => {
    if (!nftInfo) return

    // TODO: check with contract method
    const isSupportTotalSupply = false

    const { isSupportPower, totalSupply } = nftInfo
    const tokenId = tokenIds[0]!

    // TODO: check when nft with power method will be deployed
    // if power supported by ERC721
    if (isSupportPower && !isSupportTotalSupply && nftCollection && tokenId) {
      ;(async () => {
        try {
          const power = await nftCollection.getMaxPowerForNft(tokenId)

          if (power.isZero()) return
          setPower(divideBignumbers([power, 0], [totalSupply, 18]))
          return
        } catch {}
      })()
    }

    // if power and supply methods supported
    if (isSupportPower && isSupportTotalSupply && nftCollection && tokenId) {
      ;(async () => {
        try {
          const power = await nftCollection.getMaxPowerForNft(tokenId)
          const supply = await nftCollection.totalSupply()

          if (power.isZero() || supply.isZero()) return
          setPower(divideBignumbers([power, 0], [totalSupply, 0]))
          return
        } catch {}
      })()
    }
  }, [nftCollection, nftInfo, tokenIds])
}
