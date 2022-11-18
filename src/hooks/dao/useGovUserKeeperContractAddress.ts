import { useCallback, useEffect, useState } from "react"
import { useGovPoolContract } from "contracts"

export const useGovUserKeeperContractAddress = (daoPoolAddress?: string) => {
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
