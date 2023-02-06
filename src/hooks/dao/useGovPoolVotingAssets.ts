import { useCallback, useState, useEffect, useMemo } from "react"
import { isEmpty, isEqual } from "lodash"

import useError from "hooks/useError"
import { useERC20 } from "hooks"
import { useErc721 } from "hooks/useErc721"

import { Token } from "interfaces"
import { ZERO, ZERO_ADDR } from "consts"
import { parseTransactionError } from "utils"
import { useGovUserKeeperContract } from "contracts"

const initialNftInfo = {
  isSupportPower: false,
  totalPowerInTokens: ZERO,
  totalSupply: ZERO,
}

interface TokensData {
  tokenAddress: string
  nftAddress: string
  haveToken: boolean
  haveNft: boolean
}

interface NftData {
  name: string
  symbol: string
  isEnumerable: boolean
  address: string
}

interface Info {
  token: Token | null
  nft: NftData
  nftInfo: typeof initialNftInfo
}

const useGovPoolVotingAssets = (
  govPoolAddress?: string
): [TokensData, Info] => {
  const [, setError] = useError()
  const govUserKeeperContract = useGovUserKeeperContract(govPoolAddress)

  const [tokenAddress, setTokenAddress] = useState<string>("")
  const [nftAddress, setNftAddress] = useState<string>("")
  const [nftInfo, setNftInfo] = useState(initialNftInfo)

  const [, token] = useERC20(tokenAddress)
  const { name, symbol, isEnumerable } = useErc721(nftAddress)

  const nft = useMemo(
    () => ({ name, symbol, isEnumerable, address: nftAddress }),
    [name, symbol, isEnumerable, nftAddress]
  )

  const _throwTxError = useCallback((error) => {
    if (!!error && !!error.data && !!error.data.message) {
      setError(error.data.message)
    } else {
      const errorMessage = parseTransactionError(error.toString())
      !!errorMessage && setError(errorMessage)
    }
  }, [])

  const updateTokenAddress = useCallback(async () => {
    if (!govUserKeeperContract) return
    try {
      const _tokenAddress = await govUserKeeperContract.tokenAddress()
      if (_tokenAddress !== ZERO_ADDR) {
        setTokenAddress(_tokenAddress)
      }
    } catch (error: any) {
      _throwTxError(error)
    }
  }, [govUserKeeperContract])

  const updateNftAddress = useCallback(async () => {
    if (!govUserKeeperContract) return
    try {
      const _nftAddress = await govUserKeeperContract.nftAddress()
      if (_nftAddress !== ZERO_ADDR) {
        setNftAddress(_nftAddress)
      }
    } catch (error: any) {
      _throwTxError(error)
    }
  }, [govUserKeeperContract])

  const updateNftInfo = useCallback(async () => {
    try {
      const { isSupportPower, totalPowerInTokens, totalSupply } =
        await govUserKeeperContract!.getNftInfo()

      setNftInfo({ isSupportPower, totalPowerInTokens, totalSupply })
    } catch (error: any) {
      _throwTxError(error)
    }
  }, [govUserKeeperContract])

  useEffect(() => {
    if (!govUserKeeperContract) return
    ;(async () => {
      await Promise.all([
        updateTokenAddress(),
        updateNftAddress(),
        updateNftInfo(),
      ])
    })()
  }, [govUserKeeperContract])

  return [
    {
      haveToken: !isEmpty(tokenAddress) && !isEqual(tokenAddress, ZERO_ADDR),
      haveNft: !isEmpty(nftAddress) && !isEqual(nftAddress, ZERO_ADDR),
      tokenAddress,
      nftAddress,
    },
    { token, nft, nftInfo },
  ]
}

export default useGovPoolVotingAssets
