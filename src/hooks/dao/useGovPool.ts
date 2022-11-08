import { useGovPoolContract } from "contracts"
import { useCallback, useEffect, useState } from "react"

export const useGovUserKeeperAddress = (daoPoolAddress?: string) => {
  const [userKeeperAddress, setUserKeeperAddress] = useState("")
  const govPoolContract = useGovPoolContract(daoPoolAddress)

  const updateUserKeeperContract = useCallback(async () => {
    try {
      const { userKeeper } = await govPoolContract!.getHelperContracts()
      setUserKeeperAddress(userKeeper)
    } catch (error) {
      console.log("updateUserKeeperContract error: ", error)
    }
  }, [govPoolContract])

  useEffect(() => {
    if (!govPoolContract) return

    updateUserKeeperContract()
  }, [govPoolContract, updateUserKeeperContract])

  return userKeeperAddress
}
