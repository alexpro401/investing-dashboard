import { useActiveWeb3React } from "hooks"
import { usePoolsByInvestors } from "hooks/usePool"
import { useCallback, useMemo } from "react"
import { isNil } from "lodash"
import { useNavigate } from "react-router-dom"
import useAlert, { AlertType } from "hooks/useAlert"

function useInsurancePage() {
  const { account } = useActiveWeb3React()
  const navigate = useNavigate()
  const [showAlert] = useAlert()

  const investors = useMemo<string[]>(
    () => (isNil(account) ? [] : [String(account).toLocaleLowerCase()]),
    [account]
  )

  const [poolsInvestedInResponse] = usePoolsByInvestors(investors)

  const onInsuranceCreateNavigate = useCallback(() => {
    if (
      poolsInvestedInResponse.fetching ||
      isNil(poolsInvestedInResponse.data) ||
      isNil(poolsInvestedInResponse.data.traderPools)
    ) {
      return
    }

    if (poolsInvestedInResponse.data.traderPools.length === 0) {
      showAlert({
        content:
          "You can't create insurance accident proposal because you not invested in any fund yet.",
        type: AlertType.warning,
        hideDuration: 10000,
      })
      return
    }

    navigate("/insurance/create")
  }, [navigate, poolsInvestedInResponse, showAlert])

  return [
    { checkingInvestmentStatus: poolsInvestedInResponse.fetching },
    { onInsuranceCreateNavigate },
  ]
}

export default useInsurancePage
