import React, { useCallback, useEffect, useContext } from "react"
import {
  useLocation,
  useNavigate,
  generatePath,
  useParams,
} from "react-router-dom"

import { useBreakpoints } from "hooks"
import MobileRouting from "./MobileRouting"
import DesktopRouting from "./DesktopRouting"
import { ROUTE_PATHS } from "consts"
import {
  EDaoProfileTab,
  mapProfileTabToRoute,
} from "types/govPoolProfile.types"
import { GovPoolProfileTabsContext } from "context/govPool/GovPoolProfileTabsContext/GovPoolProfileTabsContext"

const Routing: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { daoAddress } = useParams()
  const { isBigTablet } = useBreakpoints()
  const { currentTab } = useContext(GovPoolProfileTabsContext)

  const handleDesktopInitialTab = useCallback(() => {
    const locationSplitted = location.pathname.split("/")
    const locationTab = locationSplitted[3]

    for (const tab in EDaoProfileTab) {
      if (mapProfileTabToRoute[EDaoProfileTab[tab]] === locationTab) {
        currentTab.set(EDaoProfileTab[tab])
        break
      }
    }
  }, [location, currentTab])

  useEffect(() => {
    if (!isBigTablet) {
      navigate(
        generatePath(ROUTE_PATHS.daoProfile, {
          daoAddress: daoAddress ?? "",
          "*": "",
        })
      )
    }
  }, [isBigTablet, daoAddress, navigate])

  useEffect(() => {
    if (isBigTablet) {
      handleDesktopInitialTab()
    }
  }, [isBigTablet, handleDesktopInitialTab])

  if (!isBigTablet) return <MobileRouting />

  return <DesktopRouting />
}

export default Routing
