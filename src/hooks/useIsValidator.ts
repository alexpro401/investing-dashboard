import { useCallback, useEffect, useState } from "react"

import { useGovPoolContract, useGovValidatorsContract } from "contracts"
import { useActiveWeb3React } from "hooks"
import { getTokenBalance } from "utils"

interface IUseValidatorProps {
  daoAddress: string
  userAddress: string
}

const useIsValidator = ({ daoAddress, userAddress }: IUseValidatorProps) => {
  const { library } = useActiveWeb3React()

  const govPoolContract = useGovPoolContract(daoAddress)

  const [govValidatorContractAddress, setGovValidatorContractAddress] =
    useState<string>("")

  const govValidatorsContract = useGovValidatorsContract(
    govValidatorContractAddress
  )

  const [result, setResult] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  const checkIfUserIsValidator = useCallback(async () => {
    if (!govValidatorsContract) return

    try {
      setLoading(true)
      setError(false)
      const validatorTokenAddress =
        await govValidatorsContract.govValidatorsToken()

      const balance = await getTokenBalance(
        userAddress,
        validatorTokenAddress,
        library
      )
      setResult(balance.gt(0))
    } catch (error) {
      console.log(error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [govValidatorsContract, userAddress, library])

  const setupGovValidatorsContract = useCallback(async () => {
    if (!govPoolContract) return

    const _govValidatorsContractAddress = await govPoolContract.govValidators()
    setGovValidatorContractAddress(_govValidatorsContractAddress)
  }, [govPoolContract])

  useEffect(() => {
    setupGovValidatorsContract()
  }, [govPoolContract, setupGovValidatorsContract])

  useEffect(() => {
    checkIfUserIsValidator()
  }, [checkIfUserIsValidator])

  return [result, loading, error]
}

export default useIsValidator
