import { IGovPoolWithdrawableAssets } from "interfaces/contracts/IGovPool"
import { useGovPoolContract } from "contracts"
import { useCallback, useEffect, useState } from "react"

interface Props {
  daoPoolAddress?: string
  delegator?: string | null
  delegatee?: string | null
}

const useGovPoolWithdrawableAssets = ({
  daoPoolAddress,
  delegator,
  delegatee = "0x0000000000000000000000000000000000000000",
}: Props) => {
  const [withdrawableAssets, setWithdrawableAssets] =
    useState<IGovPoolWithdrawableAssets>()
  const govPool = useGovPoolContract(daoPoolAddress)

  const getWithdrawableAssets = useCallback(async () => {
    if (!govPool || !delegator || !delegatee) return

    try {
      const data = await govPool.getWithdrawableAssets(delegator, delegatee)

      setWithdrawableAssets(data)
    } catch (error) {
      console.error(error)
    }
  }, [delegatee, delegator, govPool])

  useEffect(() => {
    getWithdrawableAssets()
  }, [getWithdrawableAssets])

  return withdrawableAssets
}

export default useGovPoolWithdrawableAssets
