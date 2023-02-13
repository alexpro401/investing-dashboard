import { BigNumber } from "@ethersproject/bignumber"
import { AppButton } from "common"
import IconButton from "components/IconButton"
import { useBreakpoints } from "hooks"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"
import * as React from "react"
import { IPoolMetadata } from "state/ipfsMetadata/types"
import { InvestProposalMetadata } from "types"
import * as S from "./styled"

import settingsIcon from "assets/icons/settings.svg"
import settingsGreenIcon from "assets/icons/settings-green.svg"
import Icon from "components/Icon"
import { expandTimestamp, normalizeBigNumber } from "utils"
import ReadMore from "components/ReadMore"
import { DATE_TIME_FORMAT } from "consts"
import { format } from "date-fns"
import { useTranslation } from "react-i18next"

type Props = {
  poolAddress: string
  payload: {
    poolMetadata: IPoolMetadata | null
    poolInfo: IPoolInfo | null
    proposalMetadata: InvestProposalMetadata
    dividentsTotalAmount: BigNumber
    yourBalance: BigNumber
    isUserHaveInvestments: boolean
    fullness: BigNumber
    expirationTimestamp: number
    expirationDateCompleted: boolean
    poolPriceUSD: BigNumber
    supply: BigNumber
    supplyCompleted: boolean
    apr: BigNumber
    dividendsAvailable: BigNumber
    youSizeLP: BigNumber
    maxSizeLP: BigNumber
    totalInvestors: BigNumber
    maximumPoolInvestors: BigNumber
    isCompleted: boolean
  }
  isSettingsOpen: boolean
  toggleSettings: (e: React.MouseEvent<HTMLElement>) => void
  onPayDividends: () => void
  onWithdraw: () => void
}

const CardInvestProposalBodyTrader: React.FC<Props> = ({
  poolAddress,
  payload,
  isSettingsOpen,
  toggleSettings,
  onPayDividends,
  onWithdraw,
}) => {
  const {
    poolMetadata,
    proposalMetadata,
    poolInfo,

    dividentsTotalAmount,
    expirationTimestamp,
    expirationDateCompleted,
    supply,
    supplyCompleted,
    apr,
    dividendsAvailable,
    youSizeLP,
    maxSizeLP,
    totalInvestors,
    maximumPoolInvestors,
    isCompleted,
  } = payload
  const { isDesktop } = useBreakpoints()
  const { t } = useTranslation()

  const proposalTicker = React.useMemo(
    () => proposalMetadata?.ticker ?? "",
    [proposalMetadata]
  )
  const poolTicker = React.useMemo(() => poolInfo?.ticker ?? "", [poolInfo])

  return (
    <>
      <S.CardInvestProposalGridItemFlexy
        gridColumn={isDesktop ? "1/2" : "1/3"}
        gridRow={isDesktop ? "1/3" : "auto"}
      >
        <S.CardInvestProposalValueWithIconWrp>
          <Icon
            size={isDesktop ? 36 : 24}
            m="0"
            source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
            address={poolAddress}
          />
          <S.CardInvestProposalValueWrp>
            {isDesktop && (
              <S.CardInvestProposalLabel>
                {t("card-invest-proposal.label-proposal-ticker")}
              </S.CardInvestProposalLabel>
            )}
            <S.CardInvestProposalValueWithIconWrp>
              <S.CardInvestProposalValue>
                {poolTicker}
              </S.CardInvestProposalValue>
              {isDesktop && (
                <IconButton
                  size={12}
                  media={isSettingsOpen ? settingsGreenIcon : settingsIcon}
                  onClick={toggleSettings}
                />
              )}
            </S.CardInvestProposalValueWithIconWrp>
          </S.CardInvestProposalValueWrp>
        </S.CardInvestProposalValueWithIconWrp>
      </S.CardInvestProposalGridItemFlexy>
      {!isDesktop && (
        <S.CardInvestProposalGridItem
          gridColumn={isDesktop ? "1/2" : "3/4"}
          gridRow={isDesktop ? "1/2" : "auto"}
        >
          <S.CardInvestProposalSettingsActionWrp>
            <S.CardInvestProposalStatus active={isCompleted}>
              {t(
                isCompleted
                  ? "card-invest-proposal.status-open"
                  : "card-invest-proposal.status-closed"
              )}
            </S.CardInvestProposalStatus>
            <IconButton
              size={12}
              media={isSettingsOpen ? settingsGreenIcon : settingsIcon}
              onClick={toggleSettings}
            />
          </S.CardInvestProposalSettingsActionWrp>
        </S.CardInvestProposalGridItem>
      )}

      <S.CardInvestProposalGridDivider
        divider="row"
        gridColumn={isDesktop ? "1/7" : "1/4"}
        gridRow={isDesktop ? "3/4" : "2/3"}
      />

      <S.CardInvestProposalGridItem gridRow={isDesktop ? "1/2" : "auto"}>
        <S.CardInvestProposalValueWrp>
          <S.CardInvestProposalLabel>
            {t("card-invest-proposal.label-supply", {
              currency: proposalTicker,
            })}
          </S.CardInvestProposalLabel>
          <S.CardInvestProposalValue completed={supplyCompleted}>
            {normalizeBigNumber(supply, 18, 6)}
          </S.CardInvestProposalValue>
        </S.CardInvestProposalValueWrp>
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridItem
        gridRow={isDesktop ? "1/2" : "auto"}
        gridColumn={isDesktop ? "3/4" : "auto"}
      >
        <S.CardInvestProposalValueWrp>
          <S.CardInvestProposalLabel>
            {t("card-invest-proposal.label-your-size", {
              currency: proposalTicker,
            })}
          </S.CardInvestProposalLabel>
          <S.CardInvestProposalValue>
            {normalizeBigNumber(youSizeLP, 18, 6)}
          </S.CardInvestProposalValue>
        </S.CardInvestProposalValueWrp>
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridItem
        gridRow={isDesktop ? "2/3" : "auto"}
        gridColumn={isDesktop ? "3/4" : "auto"}
      >
        <S.CardInvestProposalValueWrp
          alignment={!isDesktop ? "flex-end" : "initial"}
        >
          <S.CardInvestProposalLabel>
            {t("card-invest-proposal.label-max-size", {
              currency: poolTicker,
            })}
          </S.CardInvestProposalLabel>
          <S.CardInvestProposalValue>
            {normalizeBigNumber(maxSizeLP, 18, 6)}
          </S.CardInvestProposalValue>
        </S.CardInvestProposalValueWrp>
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridItem gridRow={isDesktop ? "2/3" : "auto"}>
        <S.CardInvestProposalValueWrp>
          <S.CardInvestProposalLabel>
            {t("card-invest-proposal.label-apr")}
          </S.CardInvestProposalLabel>
          <S.CardInvestProposalValue>
            {normalizeBigNumber(apr, 4, 2)}%
          </S.CardInvestProposalValue>
        </S.CardInvestProposalValueWrp>
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridItem gridRow={isDesktop ? "1/2" : "auto"}>
        <S.CardInvestProposalValueWrp>
          <S.CardInvestProposalLabel>
            {t("card-invest-proposal.label-dividends-avail", {
              currency: "$",
            })}
          </S.CardInvestProposalLabel>
          <S.CardInvestProposalValue>
            ~{normalizeBigNumber(dividendsAvailable, 18, 6)}
          </S.CardInvestProposalValue>
        </S.CardInvestProposalValueWrp>
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridItem gridRow={isDesktop ? "2/3" : "auto"}>
        <S.CardInvestProposalValueWrp
          alignment={!isDesktop ? "flex-end" : "initial"}
        >
          <S.CardInvestProposalLabel>
            {t("card-invest-proposal.label-dividends-total", {
              currency: "$",
            })}
          </S.CardInvestProposalLabel>
          <S.CardInvestProposalValue>
            ~{normalizeBigNumber(dividentsTotalAmount, 18, 6)}
          </S.CardInvestProposalValue>
        </S.CardInvestProposalValueWrp>
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridItem gridRow={isDesktop ? "2/3" : "auto"}>
        <S.CardInvestProposalValueWrp>
          <S.CardInvestProposalLabel>
            {t("card-invest-proposal.label-investors")}
          </S.CardInvestProposalLabel>
          <S.CardInvestProposalValue>
            {totalInvestors.toString()} /{" "}
            <span>{maximumPoolInvestors.toString()}</span>
          </S.CardInvestProposalValue>
        </S.CardInvestProposalValueWrp>
      </S.CardInvestProposalGridItem>

      {!isDesktop && (
        <S.CardInvestProposalGridItem gridRow={isDesktop ? "1/2" : "auto"}>
          <S.CardInvestProposalValueWrp>
            <S.CardInvestProposalLabel>
              {t("card-invest-proposal.label-price-otc")}
            </S.CardInvestProposalLabel>
            <S.CardInvestProposalValue>-</S.CardInvestProposalValue>
          </S.CardInvestProposalValueWrp>
        </S.CardInvestProposalGridItem>
      )}

      <S.CardInvestProposalGridItem gridRow={isDesktop ? "1/2" : "auto"}>
        <S.CardInvestProposalValueWrp
          alignment={!isDesktop ? "flex-end" : "initial"}
        >
          <S.CardInvestProposalLabel>
            {t("card-invest-proposal.label-expiration-date")}
          </S.CardInvestProposalLabel>
          <S.CardInvestProposalValue completed={expirationDateCompleted} small>
            {format(expandTimestamp(expirationTimestamp), DATE_TIME_FORMAT)}
          </S.CardInvestProposalValue>
        </S.CardInvestProposalValueWrp>
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridItem
        gridColumn={isDesktop ? "1 / 7" : "1/span 3"}
      >
        <S.CardInvestProposalDescriptionWrp>
          <ReadMore
            content={
              proposalMetadata.description.length > 0
                ? proposalMetadata.description
                : t("card-invest-proposal.empty-description-msg")
            }
            maxLen={isDesktop ? 140 : undefined}
          />
        </S.CardInvestProposalDescriptionWrp>
      </S.CardInvestProposalGridItem>

      {isDesktop && (
        <>
          <S.CardInvestProposalGridItem gridRow={isDesktop ? "1/2" : "auto"}>
            <AppButton
              full
              text={t("card-invest-proposal.action-pay-dividends")}
              color={"tertiary"}
              size={"small"}
              onClick={onPayDividends}
            />
          </S.CardInvestProposalGridItem>
          <S.CardInvestProposalGridItem gridRow={isDesktop ? "2/3" : "auto"}>
            <AppButton
              full
              text={t("card-invest-proposal.action-withdraw")}
              color={"secondary"}
              size={"small"}
              onClick={onWithdraw}
            />
          </S.CardInvestProposalGridItem>
        </>
      )}
    </>
  )
}

export default CardInvestProposalBodyTrader
