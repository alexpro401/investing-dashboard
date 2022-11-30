import { IGovDelegations } from "interfaces/contracts/IGovUserKeeper"
import { useGovUserKeeperContract } from "contracts"
import { useCallback, useEffect, useState } from "react"

interface Props {
  daoPoolAddress?: string
  user?: string | null
}

const useGovPoolDelegations = ({ daoPoolAddress, user }: Props) => {
  const [delegations, setDelegations] = useState<IGovDelegations>()
  const userKeeper = useGovUserKeeperContract(daoPoolAddress)

  const getDelegations = useCallback(async () => {
    if (!userKeeper || !user) return

    try {
      const data = await userKeeper.delegations(user)

      setDelegations(data)
    } catch (error) {
      console.error(error)
    }
  }, [userKeeper, user])

  useEffect(() => {
    getDelegations()
  }, [getDelegations])

  return delegations
}

export default useGovPoolDelegations
