import React, { useContext, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { map } from "lodash"

import { GovPoolProfileCommonContext } from "context/govPool/GovPoolProfileCommonContext/GovPoolProfileCommonContext"
import { GovPoolProfileTabsContext } from "context/govPool/GovPoolProfileTabsContext/GovPoolProfileTabsContext"
import { Flex } from "theme"
import extractRootDomain from "utils/extractRootDomain"
import TabFallback from "../../TabFallback"
import {
  HighlightHeaderDesktop,
  DesktopStatistic,
  DaoProfileChart,
  DaoProfileTokensInTreasuryCard,
} from "../../../components"
import { PageChart } from "../../../types"

import * as SCommon from "../styled"
import * as S from "./styled"

const AboutTab: React.FC = () => {
  const { descriptionObject } = useContext(GovPoolProfileCommonContext)
  const { aboutDaoLoading } = useContext(GovPoolProfileTabsContext)

  const [chart, setChart] = useState<PageChart>(PageChart.tvl)

  if (descriptionObject === undefined || aboutDaoLoading) return <TabFallback />

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
        <S.TreasurySection>
          <DaoProfileTokensInTreasuryCard />
        </S.TreasurySection>
      </S.ChartTreasuryWrp>
      <S.DecriptionDetailsWrp>
        <SCommon.SectionTitle>About DAO</SCommon.SectionTitle>
        <div />
        <S.DescriptionCard>
          {descriptionObject && descriptionObject.description && (
            <S.DescriptionText>
              {descriptionObject.description}
            </S.DescriptionText>
          )}
        </S.DescriptionCard>
        {descriptionObject &&
        (descriptionObject.documents.length > 0 ||
          descriptionObject.socialLinks.filter((el) => !!el[1]).length > 6) ? (
          <S.DescriptionLinksCard>
            {map(descriptionObject.documents, (document) => (
              <Flex key={uuidv4()} full ai="center" jc="space-between" gap="16">
                <S.LinkLabel>{document.name}</S.LinkLabel>
                <S.LinkExternaLink href={document.url}>
                  {extractRootDomain(document.url)}
                </S.LinkExternaLink>
              </Flex>
            ))}
            {descriptionObject.socialLinks.filter((el) => !!el[1]).length >
              6 && (
              <>
                <S.Divider />
                {descriptionObject.socialLinks
                  .slice(5)
                  .filter((el) => !!el[1])
                  .map((customSocialLink) => (
                    <Flex
                      key={uuidv4()}
                      full
                      ai="center"
                      jc="space-between"
                      gap="16"
                    >
                      <S.LinkLabel></S.LinkLabel>
                      <S.LinkExternaLink href={customSocialLink[1]}>
                        {extractRootDomain(customSocialLink[1])}
                      </S.LinkExternaLink>
                    </Flex>
                  ))}
              </>
            )}
          </S.DescriptionLinksCard>
        ) : (
          <div />
        )}
      </S.DecriptionDetailsWrp>
    </Flex>
  )
}

export default AboutTab
