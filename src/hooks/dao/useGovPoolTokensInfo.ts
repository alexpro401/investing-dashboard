import { useCallback, useEffect, useState } from "react"
import { useGovUserKeeperContract } from "contracts"
import { IGovNftInfo } from "interfaces/contracts/IGovUserKeeper"

const useGovPoolTokensInfo = (
  daoPoolAddress?: string
): [{ tokenAddress: string; nftAddress }, IGovNftInfo | undefined] => {
  const userKeeper = useGovUserKeeperContract(daoPoolAddress)

  const [tokenAddress, setTokenAddress] = useState("")
  const [nftAddress, setNftAddress] = useState("")
  const [nftInfo, setNftInfo] = useState<IGovNftInfo | undefined>()

  const getTokenAddress = useCallback(async () => {
    const _address = await userKeeper!.tokenAddress()
    setTokenAddress(_address)
  }, [userKeeper])

  const getNftAddress = useCallback(async () => {
    const _address = await userKeeper!.nftAddress()
    setNftAddress(_address)
  }, [userKeeper])

  const getNftInfo = useCallback(async () => {
    const _info = await userKeeper!.nftInfo()
    setNftInfo(_info)
  }, [userKeeper])

  useEffect(() => {
    if (!userKeeper) return

    try {
      getTokenAddress()
      getNftAddress()
      getNftInfo()
    } catch (error) {
      console.error("useGovPoolTokensInfo error: ", error)
    }
  }, [getNftAddress, getNftInfo, getTokenAddress, userKeeper])

  return [{ tokenAddress, nftAddress }, nftInfo]
}

export default useGovPoolTokensInfo
