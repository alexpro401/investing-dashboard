import { useCallback, useEffect, useState } from "react"

import { useGovValidatorsContract } from "contracts"
import { useActiveWeb3React } from "hooks"
import { getTokenBalance } from "utils"

interface IUseValidatorProps {
  daoAddress: string
  userAddress: string
}

const useIsValidator = ({ daoAddress, userAddress }: IUseValidatorProps) => {
  const { library } = useActiveWeb3React()

  const govValidatorsContract = useGovValidatorsContract(daoAddress)

  const [result, setResult] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

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

  useEffect(() => {
    checkIfUserIsValidator()
  }, [checkIfUserIsValidator])

  return [result, loading, error]
}

export default useIsValidator
