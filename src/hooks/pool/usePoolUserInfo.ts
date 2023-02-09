import { isAddress } from "@ethersproject/address"

import { useTraderPoolContract } from "contracts"
import { ITraderPool } from "interfaces/typechain/TraderPool"
import { isNil } from "lodash"
import * as React from "react"

const usePoolUserInfo = (
  poolAddress: string,
  userAddress: string
): ITraderPool.UserInfoStructOutput | null => {
  const traderPoolContract = useTraderPoolContract(poolAddress)

  const [userInfo, setUserInfo] =
    React.useState<ITraderPool.UserInfoStructOutput | null>(null)

  const getUserInfo = React.useCallback(async () => {
    if (
      isNil(traderPoolContract) ||
      isNil(userAddress) ||
      !isAddress(userAddress)
    ) {
      return null
    }

    try {
      const usersData = await traderPoolContract.getUsersInfo(userAddress, 0, 0)
      if (usersData && !!usersData.length) {
        return usersData[0]
      }
      return null
    } catch (error) {
      console.error(error)
      return null
    }
  }, [traderPoolContract, userAddress])

  React.useEffect(() => {
    getUserInfo().then((data) => setUserInfo(data ?? null))
  }, [getUserInfo])

  return userInfo
}

export default usePoolUserInfo
