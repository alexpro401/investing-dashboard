import React from "react"

import GovPoolProfileTabsContextProvider from "context/govPool/GovPoolProfileTabsContext/GovPoolProfileTabsContext"
import GovPoolProfileCommonContextProvider from "context/govPool/GovPoolProfileCommonContext/GovPoolProfileCommonContext"
import InnerDaoProfile from "./DaoProfile"

const DaoProfile: React.FC = () => {
  return (
    <GovPoolProfileCommonContextProvider>
      <GovPoolProfileTabsContextProvider>
        <InnerDaoProfile />
      </GovPoolProfileTabsContextProvider>
    </GovPoolProfileCommonContextProvider>
  )
}

export default DaoProfile
