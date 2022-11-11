import { useCallback, useState, useEffect } from "react"
import { isEmpty, isEqual } from "lodash"

import useError from "hooks/useError"
import { useERC20 } from "hooks/useERC20"
import { useErc721 } from "hooks/useErc721"

import { ZERO_ADDR } from "constants/index"
import { parseTransactionError } from "utils"
import { useGovUserKeeperContract } from "contracts"

const useGovPoolVotingAssets = (govPoolAddress: string) => {
  const [, setError] = useError()
  const govUserKeeperContract = useGovUserKeeperContract(govPoolAddress)

  const [tokenAddress, setTokenAddress] = useState<string>("")
  const [nftAddress, setNftAddress] = useState<string>("")

  const [, token] = useERC20(tokenAddress)
  const nft = useErc721(nftAddress)

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

  useEffect(() => {
    if (!govUserKeeperContract) return
    ;(async () => {
      await Promise.all([updateTokenAddress(), updateNftAddress()])
    })()
  }, [govUserKeeperContract])

  return [
    {
      haveToken: !isEmpty(tokenAddress) && !isEqual(tokenAddress, ZERO_ADDR),
      haveNft: !isEmpty(nftAddress) && !isEqual(nftAddress, ZERO_ADDR),
      tokenAddress,
      nftAddress,
    },
    { token, nft },
  ]
}

export default useGovPoolVotingAssets
