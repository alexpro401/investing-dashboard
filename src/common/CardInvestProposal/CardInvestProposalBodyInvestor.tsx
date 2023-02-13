import { AppButton, Icon as IconCommon } from "common"
import Icon from "components/Icon"
import TokenIcon from "components/TokenIcon"
import { DATE_TIME_FORMAT, ICON_NAMES } from "consts"
import { BigNumber } from "ethers"
import { useBreakpoints } from "hooks"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"
import { format } from "date-fns"
import * as React from "react"
import { IPoolMetadata } from "state/ipfsMetadata/types"
import { InvestProposalMetadata } from "types"
import { expandTimestamp, normalizeBigNumber } from "utils"
import * as S from "./styled"
import ReadMore from "components/ReadMore"
import { Token } from "interfaces"

type Props = {
  poolAddress: string
  payload: {
    poolMetadata: IPoolMetadata | null
    poolInfo: IPoolInfo | null
    proposalMetadata: InvestProposalMetadata
    baseTokenData: Token | null
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
  }
  onStake: () => void
  onRequestDividends: () => void
}

const CardInvestProposalBodyInvestor: React.FC<Props> = ({
  poolAddress,
  payload,
  onStake,
  onRequestDividends,
}) => {
  const {
    poolInfo,
    poolMetadata,
    proposalMetadata,
    baseTokenData,

    dividentsTotalAmount,
    yourBalance,
    isUserHaveInvestments,
    fullness,
    expirationTimestamp,
    expirationDateCompleted,
    poolPriceUSD,
    supply,
    supplyCompleted,
    apr,
    dividendsAvailable,
  } = payload
  const { isDesktop } = useBreakpoints()

  const proposalTicker = React.useMemo(
    () => proposalMetadata?.ticker ?? "",
    [proposalMetadata]
  )

  const baseTokenSymbol = React.useMemo(
    () => baseTokenData?.symbol ?? "",
    [baseTokenData]
  )

  return isUserHaveInvestments ? (
    <>
      <S.CardInvestProposalGridItem
        gridColumn={isDesktop ? "1/2" : "1/3"}
        gridRow={isDesktop ? "2/3" : "auto"}
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
                Proposal ticker
              </S.CardInvestProposalLabel>
            )}
            <S.CardInvestProposalValue>
              {proposalTicker}
            </S.CardInvestProposalValue>
          </S.CardInvestProposalValueWrp>
        </S.CardInvestProposalValueWithIconWrp>
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridItem
        gridColumn={isDesktop ? "1/2" : "3/4"}
        gridRow={isDesktop ? "1/2" : "auto"}
      >
        <S.CardInvestProposalFundTickerWrp>
          <TokenIcon
            address={poolInfo?.parameters.baseToken}
            m="0"
            size={isDesktop ? 36 : 24}
          />
          <S.CardInvestProposalValueWrp
            alignment={isDesktop ? "initial" : "flex-end"}
          >
            {isDesktop && (
              <S.CardInvestProposalLabel>Fund ticker</S.CardInvestProposalLabel>
            )}
            <S.CardInvestProposalValue>
              {poolInfo?.ticker ?? ""}
            </S.CardInvestProposalValue>
          </S.CardInvestProposalValueWrp>
        </S.CardInvestProposalFundTickerWrp>
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridDivider
        divider="row"
        gridColumn={isDesktop ? "1/7" : "1/4"}
        gridRow={isDesktop ? "3/4" : "auto"}
      />

      <S.CardInvestProposalGridItem gridRow={isDesktop ? "1/2" : "auto"}>
        <S.CardInvestProposalValueWrp>
          <S.CardInvestProposalLabel>
            Supply ({proposalTicker})
          </S.CardInvestProposalLabel>
          <S.CardInvestProposalValue completed={supplyCompleted}>
            {normalizeBigNumber(supply, 18, 6)}
          </S.CardInvestProposalValue>
        </S.CardInvestProposalValueWrp>
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridItem gridRow={isDesktop ? "1/2" : "auto"}>
        <S.CardInvestProposalValueWrp>
          <S.CardInvestProposalLabel>Fulness</S.CardInvestProposalLabel>
          <S.CardInvestProposalValue>
            {normalizeBigNumber(fullness, 18, 2)}%
          </S.CardInvestProposalValue>
        </S.CardInvestProposalValueWrp>
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridItem gridRow={isDesktop ? "2/3" : "auto"}>
        <S.CardInvestProposalValueWrp>
          <S.CardInvestProposalLabel>
            Your balance ({baseTokenSymbol})
          </S.CardInvestProposalLabel>
          <S.CardInvestProposalValue>
            {normalizeBigNumber(yourBalance, 18, 6)}
          </S.CardInvestProposalValue>
        </S.CardInvestProposalValueWrp>
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridItem gridRow={isDesktop ? "1/2" : "auto"}>
        <S.CardInvestProposalValueWrp>
          <S.CardInvestProposalLabel>APR</S.CardInvestProposalLabel>
          <S.CardInvestProposalValue>
            {normalizeBigNumber(apr, 4, 2)}%
          </S.CardInvestProposalValue>
        </S.CardInvestProposalValueWrp>
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridItem gridRow={isDesktop ? "1/2" : "auto"}>
        <S.CardInvestProposalValueWrp>
          <S.CardInvestProposalLabel>
            Total dividends ($)
          </S.CardInvestProposalLabel>
          <S.CardInvestProposalValue>
            ~{normalizeBigNumber(dividentsTotalAmount, 18, 6)}
          </S.CardInvestProposalValue>
        </S.CardInvestProposalValueWrp>
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridItem
        gridRow={isDesktop ? "2/3" : "auto"}
        gridColumn={isDesktop ? "5/6" : "auto"}
      >
        <S.CardInvestProposalValueWrp>
          <S.CardInvestProposalLabel>
            Dividends avail. ($)
          </S.CardInvestProposalLabel>
          <S.CardInvestProposalValue>
            ~{normalizeBigNumber(dividendsAvailable, 18, 6)}
          </S.CardInvestProposalValue>
        </S.CardInvestProposalValueWrp>
      </S.CardInvestProposalGridItem>

      {!isDesktop && (
        <S.CardInvestProposalGridItem gridRow={"auto"}>
          <S.CardInvestProposalValueWrp>
            <S.CardInvestProposalLabel>Custodian</S.CardInvestProposalLabel>
            <S.CardInvestProposalValue>-</S.CardInvestProposalValue>
          </S.CardInvestProposalValueWrp>
        </S.CardInvestProposalGridItem>
      )}

      <S.CardInvestProposalGridItem gridRow={isDesktop ? "2/3" : "auto"}>
        <S.CardInvestProposalValueWrp>
          <S.CardInvestProposalLabel>Price OTC</S.CardInvestProposalLabel>
          <S.CardInvestProposalValue>-</S.CardInvestProposalValue>
        </S.CardInvestProposalValueWrp>
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridItem gridRow={isDesktop ? "2/3" : "auto"}>
        <S.CardInvestProposalValueWrp>
          <S.CardInvestProposalLabel>Expiration date</S.CardInvestProposalLabel>
          <S.CardInvestProposalValue completed={expirationDateCompleted} small>
            {format(expandTimestamp(expirationTimestamp), DATE_TIME_FORMAT)}
          </S.CardInvestProposalValue>
        </S.CardInvestProposalValueWrp>
      </S.CardInvestProposalGridItem>

      {isDesktop && (
        <>
          <S.CardInvestProposalGridItem gridRow={"1/2"} gridColumn={"6/7"}>
            <AppButton
              full
              text="Stake LP"
              color={"tertiary"}
              size={"small"}
              onClick={onStake}
            />
          </S.CardInvestProposalGridItem>
          <S.CardInvestProposalGridItem gridRow={"2/3"} gridColumn={"6/7"}>
            <AppButton
              full
              text="Request a dividend"
              color={"secondary"}
              size={"small"}
              onClick={onRequestDividends}
            />
          </S.CardInvestProposalGridItem>
        </>
      )}

      <S.CardInvestProposalGridItem gridColumn={isDesktop ? "1/7" : "1/span 3"}>
        <S.CardInvestProposalDescriptionWrp>
          <ReadMore
            content={
              proposalMetadata.description.length > 0
                ? proposalMetadata.description
                : `t("card-risky-proposal.empty-description-msg")`
            }
            maxLen={isDesktop ? 140 : undefined}
          />
        </S.CardInvestProposalDescriptionWrp>
      </S.CardInvestProposalGridItem>
    </>
  ) : (
    <>
      <S.CardInvestProposalGridItem
        gridColumn={isDesktop ? "2/3" : "1/3"}
        gridRow={isDesktop ? "1/2" : "auto"}
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
                Proposal ticker
              </S.CardInvestProposalLabel>
            )}
            <S.CardInvestProposalValue>
              {proposalTicker}
            </S.CardInvestProposalValue>
          </S.CardInvestProposalValueWrp>
        </S.CardInvestProposalValueWithIconWrp>
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridItem
        gridColumn={isDesktop ? "1/2" : "3/4"}
        gridRow={isDesktop ? "1/2" : "auto"}
      >
        <S.CardInvestProposalFundTickerWrp>
          <TokenIcon
            address={poolInfo?.parameters.baseToken}
            m="0"
            size={isDesktop ? 36 : 24}
          />
          <S.CardInvestProposalValueWrp
            alignment={isDesktop ? "initial" : "flex-end"}
          >
            {isDesktop && (
              <S.CardInvestProposalLabel>Fund ticker</S.CardInvestProposalLabel>
            )}
            <S.CardInvestProposalValue>
              {poolInfo?.ticker ?? ""}
            </S.CardInvestProposalValue>
          </S.CardInvestProposalValueWrp>
        </S.CardInvestProposalFundTickerWrp>
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridDivider
        divider="row"
        gridColumn={isDesktop ? "1/9" : "1/4"}
        gridRow={isDesktop ? "2/3" : "auto"}
      />

      <S.CardInvestProposalGridItem gridRow={isDesktop ? "1/2" : "auto"}>
        <S.CardInvestProposalValueWrp>
          <S.CardInvestProposalLabel>Proposal size</S.CardInvestProposalLabel>
          <S.CardInvestProposalValue>
            {normalizeBigNumber(dividentsTotalAmount, 18, 6)}
          </S.CardInvestProposalValue>
        </S.CardInvestProposalValueWrp>
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridItem gridRow={isDesktop ? "1/2" : "auto"}>
        <S.CardInvestProposalValueWrp>
          <S.CardInvestProposalLabel>Fulness</S.CardInvestProposalLabel>
          <S.CardInvestProposalValue>
            {normalizeBigNumber(fullness, 19, 2)}%
          </S.CardInvestProposalValue>
        </S.CardInvestProposalValueWrp>
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridItem gridRow={isDesktop ? "1/2" : "auto"}>
        <S.CardInvestProposalValueWrp>
          <S.CardInvestProposalLabel>Expiration date</S.CardInvestProposalLabel>
          <S.CardInvestProposalValue completed={expirationDateCompleted} small>
            {format(expandTimestamp(expirationTimestamp), DATE_TIME_FORMAT)}
          </S.CardInvestProposalValue>
        </S.CardInvestProposalValueWrp>
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridItem
        gridRow={isDesktop ? "1/2" : "auto"}
        gridColumn={isDesktop ? "7/8" : "auto"}
      >
        <S.CardInvestProposalValueWrp>
          <S.CardInvestProposalLabel>Custodian</S.CardInvestProposalLabel>
          <S.CardInvestProposalValue>-</S.CardInvestProposalValue>
        </S.CardInvestProposalValueWrp>
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridItem gridRow={isDesktop ? "1/2" : "auto"}>
        <S.CardInvestProposalValueWrp>
          <S.CardInvestProposalLabel>LP price ($)</S.CardInvestProposalLabel>
          <S.CardInvestProposalValue>
            {normalizeBigNumber(poolPriceUSD, 18, 2)}
          </S.CardInvestProposalValue>
        </S.CardInvestProposalValueWrp>
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridItem gridRow={isDesktop ? "1/2" : "auto"}>
        <AppButton
          full
          text="Stake LP"
          color={"tertiary"}
          size={"small"}
          onClick={onStake}
        />
      </S.CardInvestProposalGridItem>

      <S.CardInvestProposalGridItem gridColumn={isDesktop ? "1/9" : "1/span 3"}>
        <S.CardInvestProposalDescriptionWrp>
          {isDesktop && <IconCommon name={ICON_NAMES.fileDock} />}
          <ReadMore
            content={
              proposalMetadata.description.length > 0
                ? proposalMetadata.description
                : `t("card-risky-proposal.empty-description-msg")`
            }
            maxLen={isDesktop ? 140 : undefined}
          />
        </S.CardInvestProposalDescriptionWrp>
      </S.CardInvestProposalGridItem>
    </>
  )
}

export default CardInvestProposalBodyInvestor
