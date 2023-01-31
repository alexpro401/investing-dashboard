import React, { useContext } from "react"

import { GovPoolProfileCommonContext } from "context/govPool/GovPoolProfileCommonContext/GovPoolProfileCommonContext"
import TabFallback from "../TabFallback"
import { HighlightHeaderDesktop, DesktopStatistic } from "../../components"
import { Flex } from "theme"

import * as S from "./styled"

const AboutTab: React.FC = () => {
  const { descriptionObject } = useContext(GovPoolProfileCommonContext)

  if (descriptionObject === undefined) return <TabFallback />

  return (
    <Flex full gap="48" dir="column">
      <HighlightHeaderDesktop />
      <DesktopStatistic />
      <S.SectionTitle>Мой кабинет?</S.SectionTitle>
    </Flex>
  )
}

export default AboutTab
