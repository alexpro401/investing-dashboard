import { FC, HTMLAttributes, useMemo } from "react"

import * as S from "./styled"
import { useTranslation } from "react-i18next"
import { v4 as uuidv4 } from "uuid"
import theme from "theme"
import { ICON_NAMES } from "consts"

interface Props extends HTMLAttributes<HTMLDivElement> {
  tokenSale: any
}

const TokenSaleCard: FC<Props> = ({ ...rest }) => {
  const { t } = useTranslation()

  const Statistics = useMemo(
    () => [
      {
        label: (
          <S.StatisticItemLabelText>
            {t("Сколько получили токенов")}
          </S.StatisticItemLabelText>
        ),
        value: <S.StatisticItemValueText>500 DGB</S.StatisticItemValueText>,
      },
      {
        label: (
          <S.StatisticItemLabelText>
            {t("Сколько в локе")}
          </S.StatisticItemLabelText>
        ),
        value: (
          <>
            <S.StatisticItemValueText>500 DGB</S.StatisticItemValueText>

            <S.StatisticItemValueText
              style={{ color: theme.brandColors.secondary }}
            >
              100%
            </S.StatisticItemValueText>
          </>
        ),
      },
      {
        label: (
          <>
            <S.StatisticItemLabelText>
              {t("Период вестинга")}
            </S.StatisticItemLabelText>
            <S.StatisticTooltip id={uuidv4()}>
              {t("Период вестинга")}
            </S.StatisticTooltip>
          </>
        ),
        value: (
          <>
            <S.StatisticItemValueText>100DGB</S.StatisticItemValueText>
            <S.StatisticItemValueText
              style={{ color: theme.brandColors.secondary }}
            >
              100%
            </S.StatisticItemValueText>
          </>
        ),
      },
      {
        label: (
          <>
            <S.StatisticItemLabelText>
              {t("Доступно к клайму")}
            </S.StatisticItemLabelText>
            <S.StatisticTooltip id={uuidv4()}>
              {t("Доступно к клайму")}
            </S.StatisticTooltip>
          </>
        ),
        value: <S.StatisticItemValueText>1 DGB</S.StatisticItemValueText>,
      },
      {
        label: (
          <S.StatisticItemLabelText>
            {t("Дата след клайма")}
          </S.StatisticItemLabelText>
        ),
        value: (
          <S.StatisticItemValueText>20 JUN, 2022</S.StatisticItemValueText>
        ),
      },
    ],
    [t]
  )

  return (
    <S.Root {...rest}>
      <S.Head>
        <S.DashedBadgeWrp># 3 sale</S.DashedBadgeWrp>
        <S.HeadBuyMsgWrp>
          buy 1
          <S.HeadTokenLink
            imgUrl={
              "https://avatars.githubusercontent.com/u/30753617?s=280&v=4"
            }
            text={"1000 DGB"}
            linkUrl={"#"}
          />
          for
          <S.HeadTokenLink
            imgUrl={
              "https://avatars.githubusercontent.com/u/30753617?s=280&v=4"
            }
            text={"1000 DGB"}
            linkUrl={"#"}
          />
        </S.HeadBuyMsgWrp>
        <S.HeadActions>
          <S.HeadExplorerLink href={"#"}>link to BSCscan</S.HeadExplorerLink>
          <S.HeadActionsBtn
            text={"Details"}
            iconRight={ICON_NAMES.angleRight}
          />
        </S.HeadActions>
      </S.Head>
      <S.ProgressBar progress={50} />
      <S.Body>
        {Statistics?.map((el, idx) => (
          <S.StatisticItem key={idx}>
            <S.StatisticItemLabelWrp>{el.label}</S.StatisticItemLabelWrp>
            <S.StatisticItemValueWrp>{el.value}</S.StatisticItemValueWrp>
          </S.StatisticItem>
        ))}
      </S.Body>
    </S.Root>
  )
}

export default TokenSaleCard
