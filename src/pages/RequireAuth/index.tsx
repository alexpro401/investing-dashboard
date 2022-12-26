import { useLocation, Navigate } from "react-router-dom"
import { useWeb3React } from "@web3-react/core"
import * as S from "./styled"
import { ROUTE_PATHS } from "constants/index"

function RequireAuth() {
  const { account } = useWeb3React()
  const location = useLocation()

  if (!account) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to={ROUTE_PATHS.welcome} state={{ from: location }} />
  }

  return (
    <S.Root className={"auth__root"}>
      <S.AuthNavigation className={"auth__nav"} />
      <S.AuthMainWrp className={"auth__main-wrp"}>
        <S.AuthMain className={"auth__main"}>
          <S.AuthAppHeader className={"auth__header"} />
          <S.AuthOutletWrp className={"auth__outlet-wrp"}>
            <S.AuthOutlet />
          </S.AuthOutletWrp>
        </S.AuthMain>
      </S.AuthMainWrp>
    </S.Root>
  )
}

export default RequireAuth
