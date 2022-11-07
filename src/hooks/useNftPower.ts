import { BigNumberish } from "@ethersproject/bignumber"
import { ZERO_ADDR, ZERO } from "constants/index"
import { useERC721Contract } from "contracts"
import { useEffect, useState } from "react"
import { divideBignumbers } from "utils/formulas"
import useGovPoolTokensInfo from "./useGovPoolTokensInfo"

// TODO: get power of NFTs list using multicall hook
// const useNftPowers = () => {}

interface PropsBase {
  daoPoolAddress?: string
}

interface Props extends PropsBase {
  tokenIds: BigNumberish[]
}

const useNftsPowerNative = ({ daoPoolAddress, tokenIds }: Props) => {
  const [power, setPower] = useState(ZERO)

  const [{ nftAddress }, nftInfo] = useGovPoolTokensInfo(daoPoolAddress)
  const nftCollection = useERC721Contract(nftAddress)

  useEffect(() => {
    if (!nftInfo) return

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

interface Props {
  daoPoolAddress?: string
  tokenId?: BigNumberish
}

// @param daoPoolAddress the address of the DAO pool
// @param tokenId the id of the NFT used only for ERC721 with getMaxPowerForNft method
const useNftPower = ({ daoPoolAddress }: PropsBase) => {
  const [power, setPower] = useState(ZERO)

  const [{ nftAddress }, nftInfo] = useGovPoolTokensInfo(daoPoolAddress)
  const nftCollection = useERC721Contract(nftAddress)

  useEffect(() => {
    if (!nftInfo) return

    const isSupportTotalSupply = false

    const { isSupportPower, totalPowerInTokens, totalSupply } = nftInfo

    // if not supported power and supply by ERC721
    if (
      !isSupportPower &&
      !isSupportTotalSupply &&
      !totalPowerInTokens.isZero() &&
      !totalSupply.isZero()
    ) {
      setPower(divideBignumbers([totalPowerInTokens, 18], [totalSupply, 0]))
      return
    }

    // if only supply supported by ERC721
    if (!isSupportPower && isSupportTotalSupply && nftCollection) {
      ;(async () => {
        try {
          const supply = await nftCollection.totalSupply()

          if (supply.isZero()) return
          setPower(divideBignumbers([totalPowerInTokens, 18], [supply, 0]))
          return
        } catch {}
      })()
    }
  }, [nftInfo, nftCollection])

  // NFT's not enabled by DAO pool
  if (nftAddress === ZERO_ADDR) {
    return null
  }

  return power
}

export default useNftPower
