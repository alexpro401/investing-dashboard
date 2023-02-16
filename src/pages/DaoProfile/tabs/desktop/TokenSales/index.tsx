import React, { FC, HTMLAttributes, useMemo } from "react"

import * as S from "./styled"
import { useTranslation } from "react-i18next"
import TokenSaleCard from "./TokenSaleCard"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const mockedTokenSaleData = {}

const TokenSales: FC<Props> = ({ ...rest }) => {
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

      {myTokenSales?.map((el, idx) => (
        <TokenSaleCard key={idx} tokenSale={el} />
      )) || <></>}

      <S.SectionTitle>
        {t("dao-profile.token-sales.sales-title")}
      </S.SectionTitle>

      {tokenSales?.map((el, idx) => (
        <TokenSaleCard key={idx} tokenSale={el} />
      )) || <></>}
    </S.Root>
  )
}

export default TokenSales
