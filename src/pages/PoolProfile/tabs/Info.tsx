import { FC, HTMLAttributes, useContext } from "react"
import { v4 as uuidv4 } from "uuid"

import * as S from "./styled"
import { Card } from "common"
import { Flex } from "theme"
import { normalizeBigNumber, shortenAddress } from "utils"
import Tooltip from "components/Tooltip"
import { isEmpty } from "lodash"
import { PoolProfileContext } from "pages/PoolProfile/context"

const fundTypes = {
  BASIC_POOL: "Basic",
  INVEST_POOL: "Invest",
}

interface Props extends HTMLAttributes<HTMLDivElement> {}

const TabPoolInfo: FC<Props> = ({ ...rest }) => {
  const {
    poolData,
    poolMetadata,
    baseToken,
    isTrader,
    creationTime,
    minimalInvestment,
    emission,
    emissionLeft,
    adminsCount,
    whitelistCount,
    commissionPercentage,
  } = useContext(PoolProfileContext)

  return (
    <>
      <Card>
        <S.TabCardTitle color="#9AE2CB">Information</S.TabCardTitle>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Creation date</S.TabCardLabel>
          <S.TabCardValue color="#E4F2FF">{creationTime}</S.TabCardValue>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Fund address</S.TabCardLabel>
          <S.TabCardValue color="#E4F2FF">
            {shortenAddress(poolData.id, 2)}
          </S.TabCardValue>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Basic token</S.TabCardLabel>
          <S.TabCardValue color="#E4F2FF">{baseToken?.symbol}</S.TabCardValue>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Fund ticker</S.TabCardLabel>
          <S.TabCardValue color="#E4F2FF">{poolData.ticker}</S.TabCardValue>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Fund name</S.TabCardLabel>
          <S.TabCardValue color="#E4F2FF">{poolData.name}</S.TabCardValue>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Type of fund</S.TabCardLabel>
          <S.TabCardValue color="#E4F2FF">
            {fundTypes[poolData.type]}
          </S.TabCardValue>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel></S.TabCardLabel>
          <S.TabCardValue color="#E4F2FF"></S.TabCardValue>
        </Flex>
      </Card>

      <Card>
        <Flex full ai="center" jc="space-between">
          <S.TabCardTitle color="#9AE2CB">Fund settings</S.TabCardTitle>
          {isTrader && (
            <S.AppLink
              text="Manage"
              routePath={`/fund-details/${poolData.id}/edit`}
            />
          )}
        </Flex>

        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Minimum investment amount</S.TabCardLabel>
          <S.TabCardValue color="#E4F2FF">{minimalInvestment}</S.TabCardValue>
        </Flex>
        {emission.unlimited && (
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Emission</S.TabCardLabel>
            <S.TabCardValue color="#E4F2FF">
              {normalizeBigNumber(emission.value, 18, 6)}
            </S.TabCardValue>
          </Flex>
        )}
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Fund managers</S.TabCardLabel>
          <S.TabCardValue color="#E4F2FF">{adminsCount}</S.TabCardValue>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Limit who can invest</S.TabCardLabel>
          <S.TabCardValue color="#E4F2FF">
            {whitelistCount ? `${whitelistCount} addresses` : "off"}
          </S.TabCardValue>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Performance Fee</S.TabCardLabel>
          <S.TabCardValue color="#E4F2FF">
            {normalizeBigNumber(commissionPercentage, 25, 0)}%
          </S.TabCardValue>
        </Flex>
      </Card>
      {!emission.unlimited && (
        <Card>
          <Flex full ai="center" jc="space-between">
            <Flex ai="center" gap="4">
              <Tooltip id={uuidv4()}>Emmission explain</Tooltip>
              <S.TabCardLabel>Emission</S.TabCardLabel>
            </Flex>
            <S.TabCardValue color="#E4F2FF">
              {emissionLeft.value}
            </S.TabCardValue>
          </Flex>
          <S.ProgressBar w={emissionLeft.percentage} />
        </Card>
      )}

      <Card>
        <Flex full ai="center" jc="space-between">
          <S.TabCardTitle color="#9AE2CB">Fund description</S.TabCardTitle>
          {isTrader && (
            <S.AppLink
              text="Edit"
              routePath={`/fund-details/${poolData.id}/edit`}
            />
          )}
        </Flex>
        <S.TabCardValue
          color={!isEmpty(poolMetadata.description) ? "#E4F2FF" : "#B1C7FC"}
        >
          {!isEmpty(poolMetadata.description)
            ? poolMetadata.description
            : "No description provided"}
        </S.TabCardValue>

        <Flex full ai="center" jc="space-between">
          <S.TabCardValue color="#9AE2CB">Fund strategy</S.TabCardValue>
        </Flex>
        <S.TabCardValue
          color={!isEmpty(poolMetadata.strategy) ? "#E4F2FF" : "#B1C7FC"}
        >
          {!isEmpty(poolMetadata.strategy)
            ? poolMetadata.strategy
            : "No strategy provided"}
        </S.TabCardValue>
      </Card>
    </>
  )
}

export default TabPoolInfo
