import React, { FC, HTMLAttributes, useMemo } from "react"

import * as S from "./styled"
import { useTranslation } from "react-i18next"
import ActualCard from "./ActualCard"
import PlannedCard from "./PlannedCard"
import CompletedCard from "./CompletedCard"
import { generatePath, Routes, useParams, Route } from "react-router-dom"
import { ROUTE_PATHS } from "consts"
import MySaleCard from "./MySaleCard"
import RouteTabs from "components/RouteTabs"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const mockedTokenSaleData = {}

const TokenSales: FC<Props> = ({ ...rest }) => {
  const { daoAddress } = useParams()

  const { t } = useTranslation()

  const myTokenSales = useMemo(() => [mockedTokenSaleData], [])

  const tokenSales = useMemo(
    () => [mockedTokenSaleData, mockedTokenSaleData, mockedTokenSaleData],
    []
  )

  return (
    <S.Root {...rest}>
      <S.TutorialBlock>
        <S.TutorialTitle>
          {t("dao-profile.token-sales.tutorial-title")}
        </S.TutorialTitle>
        <S.TutorialBtn>
          {t("dao-profile.token-sales.tutorial-btn")}
        </S.TutorialBtn>
      </S.TutorialBlock>
      <S.SectionTitle>
        {t("dao-profile.token-sales.my-sales-title")}
      </S.SectionTitle>

      <MySaleCard />

      <S.SectionTitle>
        {t("dao-profile.token-sales.sales-title")}
        <S.TitleLink
          to={generatePath(ROUTE_PATHS.daoProfile, {
            daoAddress: daoAddress!,
            "*": "",
          })}
        >
          111PG
        </S.TitleLink>
      </S.SectionTitle>

      <RouteTabs
        full={false}
        tabs={[
          {
            title: "Actual",
            source: "actual",
          },
          {
            title: "Planned",
            source: "planned",
          },
          {
            title: "Completed",
            source: "completed",
          },
        ]}
      />

      <Routes>
        <Route path="actual" element={<ActualCard />} />
        <Route path="planned" element={<PlannedCard />} />
        <Route path="completed" element={<CompletedCard />} />
      </Routes>
    </S.Root>
  )
}

export default TokenSales
