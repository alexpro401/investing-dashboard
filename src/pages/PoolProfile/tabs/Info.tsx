import { FC, HTMLAttributes, useContext } from "react"
import { v4 as uuidv4 } from "uuid"

import * as S from "./styled"
import { Card } from "common"
import { Flex } from "theme"
import { DateUtil, normalizeBigNumber, shortenAddress } from "utils"
import Tooltip from "components/Tooltip"
import { PoolProfileContext } from "pages/PoolProfile/context"
import { DATE_FORMAT, ROUTE_PATHS } from "consts"
import { generatePath, useNavigate } from "react-router-dom"
import { localizePoolType } from "localization"
import { Bus } from "helpers"
import { useBreakpoints } from "hooks"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const TabPoolInfo: FC<Props> = () => {
  const {
    fundType,
    fundAddress,
    basicToken,
    fundTicker,
    fundName,

    minInvestAmount,
    emission,
    availableLPTokens,

    creationDate,
    isTrader,

    performanceFee,

    fundManagers,
    whiteList,

    fundDescription,
    fundStrategy,
  } = useContext(PoolProfileContext)

  const { isSmallTablet } = useBreakpoints()

  const navigate = useNavigate()

  return (
    <>
      <Card>
        <S.TabCardTitle>Information</S.TabCardTitle>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Creation date</S.TabCardLabel>
          {creationDate && (
            <S.TabCardValue>
              {DateUtil.format(
                DateUtil.fromTimestamp(creationDate) as Date,
                DATE_FORMAT
              )}
            </S.TabCardValue>
          )}
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Fund address</S.TabCardLabel>
          <S.TabCardValue>{shortenAddress(fundAddress, 2)}</S.TabCardValue>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Basic token</S.TabCardLabel>
          <S.TabCardValue>{basicToken?.symbol}</S.TabCardValue>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Fund ticker</S.TabCardLabel>
          <S.TabCardValue>{fundTicker}</S.TabCardValue>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Fund name</S.TabCardLabel>
          <S.TabCardValue>{fundName}</S.TabCardValue>
        </Flex>
        {fundType && (
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Type of fund</S.TabCardLabel>
            <S.TabCardValue>{localizePoolType(fundType)}</S.TabCardValue>
          </Flex>
        )}
        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel></S.TabCardLabel>
          <S.TabCardValue></S.TabCardValue>
        </Flex>
      </Card>

      <Card>
        <Flex full ai="center" jc="space-between">
          <S.TabCardTitle>Fund settings</S.TabCardTitle>
          {isTrader && fundAddress && (
            <S.AppLink
              text="Manage"
              onClick={() => {
                if (isSmallTablet) {
                  Bus.emit("manage-modal")
                } else {
                  navigate(
                    generatePath(ROUTE_PATHS.poolProfile, {
                      poolAddress: fundAddress,
                      "*": "details",
                    })
                  )
                }
              }}
            />
          )}
        </Flex>

        <Flex full ai="center" jc="space-between">
          <S.TabCardLabel>Minimum investment amount</S.TabCardLabel>
          <S.TabCardValue>
            {normalizeBigNumber(minInvestAmount, 18, 2)}
          </S.TabCardValue>
        </Flex>
        {emission?.isZero() && (
          <Flex full ai="center" jc="space-between">
            <S.TabCardLabel>Emission</S.TabCardLabel>
            <S.TabCardValue>
              {normalizeBigNumber(emission, 18, 6)}
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
      {!emission?.isZero() && (
        <Card>
          <Flex full ai="center" jc="space-between">
            <Flex ai="center" gap="4">
              <Tooltip id={uuidv4()}>Emmission explain</Tooltip>
              <S.TabCardLabel>Emission</S.TabCardLabel>
            </Flex>
            <S.TabCardValue>
              {availableLPTokens?.value?.toString() || 0}
            </S.TabCardValue>
          </Flex>
          <S.ProgressBar w={availableLPTokens?.percentage || 0} />
        </Card>
      )}

      <Card>
        <Flex full ai="center" jc="space-between">
          <S.TabCardTitle>Fund description</S.TabCardTitle>
          {isTrader && fundAddress && (
            <S.AppLink
              text="Edit"
              onClick={() => {
                if (isSmallTablet) {
                  Bus.emit("manage-modal")
                } else {
                  navigate(
                    generatePath(ROUTE_PATHS.poolProfile, {
                      poolAddress: fundAddress,
                      "*": "details",
                    })
                  )
                }
              }}
            />
          )}
        </Flex>
        <S.TabCardValue>
          {fundDescription || "No description provided"}
        </S.TabCardValue>

        <Flex full ai="center" jc="space-between">
          <S.TabCardTitle>Fund strategy</S.TabCardTitle>
        </Flex>
        <S.TabCardValue>
          {fundStrategy || "No strategy provided"}
        </S.TabCardValue>
      </Card>
    </>
  )
}

export default TabPoolInfo
