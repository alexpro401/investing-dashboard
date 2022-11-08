import { useCallback, useEffect, useState } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import { useERC20Contract } from "contracts"
import { useGovValidatorsValidatorsToken } from "hooks/dao"

const useGovValidatorsTokenTotalSupply = (
  govPoolAddress: string
): [BigNumber | null, boolean, boolean] => {
  const validatorsToken = useGovValidatorsValidatorsToken(govPoolAddress)
  const validatorsTokenContract = useERC20Contract(
    validatorsToken ? validatorsToken.address : ""
  )

  const [validatorsTokenTotalSupply, setValidatorsTokenTotalSupply] =
    useState<BigNumber | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  const handleGetTotalSupply = useCallback(async () => {
    if (!validatorsTokenContract) return

    try {
      setError(false)
      setLoading(true)

      const _totalSupply = await validatorsTokenContract.totalSupply()
      setValidatorsTokenTotalSupply(_totalSupply)
    } catch (error) {
      console.log(error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [validatorsTokenContract])

  useEffect(() => {
    handleGetTotalSupply()
  }, [handleGetTotalSupply])

  return [validatorsTokenTotalSupply, loading, error]
}

export default useGovValidatorsTokenTotalSupply
