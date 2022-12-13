import { useCallback } from "react"
import { isEmpty } from "lodash"
import { useNavigate } from "react-router-dom"

import useAlert, { AlertType } from "hooks/useAlert"
import useOwnedAndInvestedPools from "hooks/useOwnedAndInvestedPools"

function useInsurancePage() {
  const navigate = useNavigate()
  const [showAlert] = useAlert()

  const [{ data: pools, fetching }] = useOwnedAndInvestedPools()

  const onInsuranceCreateNavigate = useCallback(() => {
    if (fetching || (!fetching && isEmpty(pools))) {
      return
    }

    if (pools.length === 0) {
      showAlert({
        content:
          "You can't create insurance accident proposal because you not invested in any fund yet.",
        type: AlertType.warning,
        hideDuration: 10000,
      })
      return
    }

    navigate("/insurance/create")
  }, [navigate, fetching, pools, showAlert])

  return [
    {
      checkingInvestmentStatus: fetching,
    },
    { onInsuranceCreateNavigate },
  ]
}

export default useInsurancePage
