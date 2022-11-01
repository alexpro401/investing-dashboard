import useGovBalance from "hooks/useGovBalance"
import useGovPoolTokensInfo from "hooks/useGovPoolTokensInfo"
import { useMemo } from "react"
import { useERC20Data } from "state/erc20/hooks"

const useVotingTerminal = (daoPoolAddress?: string) => {
  const [govTokens, nftInfo] = useGovPoolTokensInfo(daoPoolAddress)
  const { tokenAddress, nftAddress } = govTokens
  const [fromData] = useERC20Data(tokenAddress)
  const tokenBalance = useGovBalance({
    daoPoolAddress,
    method: "tokenBalance",
  })
  const nftBalance = useGovBalance({
    daoPoolAddress,
    method: "nftBalance",
  })

  const formInfo = useMemo(() => {
    return {
      erc20: {
        address: tokenAddress,
        symbol: fromData?.symbol,
        decimal: fromData?.decimals,
        balance: tokenBalance,
      },
      erc721: {
        address: nftAddress,
        balance: nftBalance,
      },
    }
  }, [fromData, nftAddress, nftBalance, tokenAddress, tokenBalance])

  return formInfo
}

export default useVotingTerminal
