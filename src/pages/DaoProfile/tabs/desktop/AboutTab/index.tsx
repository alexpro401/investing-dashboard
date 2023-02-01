import React, { useContext, useState } from "react"

import { GovPoolProfileCommonContext } from "context/govPool/GovPoolProfileCommonContext/GovPoolProfileCommonContext"
import { Flex } from "theme"
import TabFallback from "../../TabFallback"
import {
  HighlightHeaderDesktop,
  DesktopStatistic,
  DaoProfileChart,
} from "../../../components"
import { PageChart } from "../../../types"

import * as SCommon from "../styled"
import * as S from "./styled"

const AboutTab: React.FC = () => {
  const { descriptionObject } = useContext(GovPoolProfileCommonContext)

  const [chart, setChart] = useState<PageChart>(PageChart.tvl)

  if (descriptionObject === undefined) return <TabFallback />

  return (
    <Flex full gap="48" dir="column">
      <HighlightHeaderDesktop />
      <DesktopStatistic />
      <S.ChartTreasuryWrp>
        <SCommon.SectionTitle>Chart</SCommon.SectionTitle>
        <SCommon.SectionTitle>DAO Treasury</SCommon.SectionTitle>
        <S.ChartSection>
          <DaoProfileChart chart={chart} setChart={setChart} />
        </S.ChartSection>
        <S.TreasurySection></S.TreasurySection>
      </S.ChartTreasuryWrp>
    </Flex>
  )
}

export default AboutTab
