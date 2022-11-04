import { BigNumber } from "@ethersproject/bignumber"
import useGovBalance from "hooks/useGovBalance"
import useGovPoolTokensInfo from "hooks/useGovPoolTokensInfo"
import useNftPower from "hooks/useNftPower"
import { useMemo } from "react"
import { useERC20Data } from "state/erc20/hooks"

const useVotingTerminal = (daoPoolAddress?: string) => {
  const [{ tokenAddress, nftAddress }] = useGovPoolTokensInfo(daoPoolAddress)
  const power = useNftPower({ daoPoolAddress })
  console.log(power?.toString())

  const [fromData] = useERC20Data(tokenAddress)

  const tokenBalance = useGovBalance<BigNumber>({
    daoPoolAddress,
    method: "tokenBalance",
  })

  const nftBalance = useGovBalance<BigNumber>({
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
