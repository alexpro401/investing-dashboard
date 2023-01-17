import { FC, HTMLAttributes, useContext } from "react"
import { v4 as uuidv4 } from "uuid"

import * as S from "./styled"
import { Card } from "common"
import { Flex } from "theme"
import { DateUtil, normalizeBigNumber, shortenAddress } from "utils"
import Tooltip from "components/Tooltip"
import { isEmpty } from "lodash"
import { PoolProfileContext } from "pages/PoolProfile/context"
import { DATE_FORMAT, ROUTE_PATHS } from "../../../consts"
import { generatePath } from "react-router-dom"

const fundTypes = {
  BASIC_POOL: "Basic",
  INVEST_POOL: "Invest",
}

interface Props extends HTMLAttributes<HTMLDivElement> {}

const TabPoolInfo: FC<Props> = ({ ...rest }) => {
  const {
    isTrader,
    creationDate,
    fundAddress,
    baseToken,
    fundTicker,
    fundName,
    fundType,
    minInvestAmount,
    emission,
    fundManagers,
    whiteList,
    performanceFee,
    fundDescription,
    fundStrategy,
    availableLPTokens,
  } = useContext(PoolProfileContext)

  return (
    <>
      <Card>
        <S.TabCardTitle>Information</S.TabCardTitle>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Creation date</S.TabCardLabel>
          <S.TabCardValue>
            {DateUtil.format(creationDate, DATE_FORMAT)}
          </S.TabCardValue>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Fund address</S.TabCardLabel>
          <S.TabCardValue>{shortenAddress(fundAddress, 2)}</S.TabCardValue>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Basic token</S.TabCardLabel>
          <S.TabCardValue>{baseToken?.symbol}</S.TabCardValue>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Fund ticker</S.TabCardLabel>
          <S.TabCardValue>{fundTicker}</S.TabCardValue>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Fund name</S.TabCardLabel>
          <S.TabCardValue>{fundName}</S.TabCardValue>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Type of fund</S.TabCardLabel>
          <S.TabCardValue>{fundTypes[fundType]}</S.TabCardValue>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel></S.TabCardLabel>
          <S.TabCardValue></S.TabCardValue>
        </Flex>
      </Card>

      <Card>
        <Flex full ai="center" jc="space-between">
          <S.TabCardTitle>Fund settings</S.TabCardTitle>
          {isTrader && (
            <S.AppLink
              text="Manage"
              routePath={generatePath(ROUTE_PATHS.fundDetails, {
                poolAddress: fundAddress,
                "*": "edit",
              })}
            />
          )}
        </Flex>

        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Minimum investment amount</S.TabCardLabel>
          <S.TabCardValue>
            {normalizeBigNumber(minInvestAmount, 18, 2)}
          </S.TabCardValue>
        </Flex>
        {emission.isZero() && (
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Emission</S.TabCardLabel>
            <S.TabCardValue>
              {normalizeBigNumber(emission.value, 18, 6)}
            </S.TabCardValue>
          </Flex>
        )}
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Fund managers</S.TabCardLabel>
          <S.TabCardValue>{fundManagers?.length}</S.TabCardValue>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Limit who can invest</S.TabCardLabel>
          <S.TabCardValue>
            {whiteList?.length ? `${whiteList?.length} addresses` : "off"}
          </S.TabCardValue>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Performance Fee</S.TabCardLabel>
          <S.TabCardValue>
            {normalizeBigNumber(performanceFee, 25, 0)}%
          </S.TabCardValue>
        </Flex>
      </Card>
      {!emission.isZero() && (
        <Card>
          <Flex full ai="center" jc="space-between">
            <Flex ai="center" gap="4">
              <Tooltip id={uuidv4()}>Emmission explain</Tooltip>
              <S.TabCardLabel>Emission</S.TabCardLabel>
            </Flex>
            <S.TabCardValue>
              {availableLPTokens.value?.toString() || 0}
            </S.TabCardValue>
          </Flex>
          <S.ProgressBar w={availableLPTokens.percentage?.toNumber() || 0} />
        </Card>
      )}

      <Card>
        <Flex full ai="center" jc="space-between">
          <S.TabCardTitle>Fund description</S.TabCardTitle>
          {isTrader && (
            <S.AppLink
              text="Edit"
              routePath={generatePath(ROUTE_PATHS.fundDetails, {
                poolAddress: fundAddress,
                "*": "",
              })}
            />
          )}
        </Flex>
        <S.TabCardValue>
          {!isEmpty(fundDescription)
            ? fundDescription
            : "No description provided"}
        </S.TabCardValue>

        <Flex full ai="center" jc="space-between">
          <S.TabCardTitle>Fund strategy</S.TabCardTitle>
        </Flex>
        <S.TabCardValue>
          {!isEmpty(fundStrategy) ? fundStrategy : "No strategy provided"}
        </S.TabCardValue>
      </Card>
    </>
  )
}

export default TabPoolInfo
