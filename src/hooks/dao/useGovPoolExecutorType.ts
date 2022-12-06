import { useMemo, useCallback } from "react"
import { useSelector } from "react-redux"

import { IExecutorType } from "types"
import { useGovPoolHelperContracts } from "hooks/dao"
import { selectInsuranceAddress } from "state/contracts/selectors"

interface IResultExecutor {
  executorAddress: string
  type: IExecutorType
}

function useGovPoolExecutorType<T extends string | string[]>(
  govPoolAddress: string,
  executorAddresses: T
): T extends string ? IResultExecutor : IResultExecutor[] {
  type ReturnType = T extends string ? IResultExecutor : IResultExecutor[]

  const {
    govDistributionProposalAddress,
    govSettingsAddress,
    govUserKeeperAddress,
    govValidatorsAddress,
  } = useGovPoolHelperContracts(govPoolAddress)
  const insuranceAddress = useSelector(selectInsuranceAddress)

  const typeFromExecutor = useCallback(
    (executorAddress: string): IExecutorType => {
      let type: IExecutorType = "custom"

      if (govPoolAddress?.toLowerCase() === executorAddress) {
        type = "profile"
      }

      if (govSettingsAddress === executorAddress) {
        type = "change-settings"
      }

      if (govDistributionProposalAddress === executorAddress) {
        type = "distribution"
      }

      if (govValidatorsAddress === executorAddress) {
        type = "change-validator-balances"
      }

      if (govUserKeeperAddress === executorAddress) {
        type = "add-token"
      }

      if (
        insuranceAddress?.toLowerCase() === executorAddress &&
        govPoolAddress?.toLowerCase() ===
          process.env.REACT_APP_DEXE_DAO_ADDRESS.toLowerCase()
      ) {
        type = "insurance"
      }

      return type
    },
    [
      govPoolAddress,
      govDistributionProposalAddress,
      govSettingsAddress,
      govUserKeeperAddress,
      govValidatorsAddress,
      insuranceAddress,
    ]
  )

  const result = useMemo(() => {
    if (Array.isArray(executorAddresses)) {
      return (
        executorAddresses?.map((executorAddress) => ({
          executorAddress,
          type: typeFromExecutor(executorAddress?.toLowerCase()),
        })) || []
      )
    }

    return {
      executorAddress: executorAddresses,
      ...(!!executorAddresses
        ? { type: typeFromExecutor(executorAddresses?.toLowerCase()) }
        : {}),
    }
  }, [executorAddresses, typeFromExecutor])

  return result as ReturnType
}

export default useGovPoolExecutorType
