import { useOwnedERC721Tokens } from "hooks/useERC721List"
import useGovBalance from "hooks/useGovBalance"
import useGovPoolTokensInfo from "hooks/useGovPoolTokensInfo"
import useNftPower from "hooks/useNftPower"
import {
  IGovNftBalance,
  IGovTokenBalance,
} from "interfaces/contracts/IGovUserKeeper"
import { useMemo } from "react"
import { useERC20Data } from "state/erc20/hooks"

const useVotingTerminal = (daoPoolAddress?: string) => {
  const [{ tokenAddress, nftAddress }] = useGovPoolTokensInfo(daoPoolAddress)
  const power = useNftPower({ daoPoolAddress })

  const ownedNftsId = useOwnedERC721Tokens(nftAddress)
  console.log(ownedNftsId)

  const [fromData] = useERC20Data(tokenAddress)

  const tokenBalance = useGovBalance<IGovTokenBalance>({
    daoPoolAddress,
    method: "tokenBalance",
  })

  const nftBalance = useGovBalance<IGovNftBalance>({
    daoPoolAddress,
    method: "nftBalance",
    isMicroPool: true,
  })

  const formInfo = useMemo(() => {
    return {
      erc20: {
        address: tokenAddress,
        symbol: fromData?.symbol,
        decimal: fromData?.decimals,
        balance: tokenBalance?.totalBalance,
      },
      erc721: {
        address: nftAddress,
        balance: nftBalance?.totalBalance,
      },
    }
  }, [fromData, nftAddress, nftBalance, tokenAddress, tokenBalance])

  return formInfo
}

export default useVotingTerminal
