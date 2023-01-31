import React, { useContext } from "react"

import { GovPoolProfileCommonContext } from "context/govPool/GovPoolProfileCommonContext/GovPoolProfileCommonContext"
import TabFallback from "../TabFallback"
import { HighlightHeaderDesktop } from "../../components"

const AboutTab: React.FC = () => {
  const { descriptionObject } = useContext(GovPoolProfileCommonContext)

  if (descriptionObject === undefined) return <TabFallback />

  return (
    <>
      <HighlightHeaderDesktop />
    </>
  )
}

export default AboutTab
