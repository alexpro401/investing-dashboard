import { FC, HTMLAttributes, useContext } from "react"
import { v4 as uuidv4 } from "uuid"

import * as S from "./styled"
import { Card } from "common"
import { Flex } from "theme"
import { shortenAddress } from "utils"
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
        <S.Value.Medium color="#9AE2CB">Information</S.Value.Medium>
        <Flex full ai="center" jc="space-between">
          <S.Label>Creation date</S.Label>
          <S.Value.Medium color="#E4F2FF">{creationTime}</S.Value.Medium>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.Label>Fund address</S.Label>
          <S.Value.Medium color="#E4F2FF">
            {shortenAddress(poolData.id, 2)}
          </S.Value.Medium>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.Label>Basic token</S.Label>
          <S.Value.Medium color="#E4F2FF">{baseToken?.symbol}</S.Value.Medium>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.Label>Fund ticker</S.Label>
          <S.Value.Medium color="#E4F2FF">{poolData.ticker}</S.Value.Medium>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.Label>Fund name</S.Label>
          <S.Value.Medium color="#E4F2FF">{poolData.name}</S.Value.Medium>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.Label>Type of fund</S.Label>
          <S.Value.Medium color="#E4F2FF">
            {fundTypes[poolData.type]}
          </S.Value.Medium>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.Label></S.Label>
          <S.Value.Medium color="#E4F2FF"></S.Value.Medium>
        </Flex>
      </Card>

      <Card>
        <Flex full ai="center" jc="space-between">
          <S.Value.Medium color="#9AE2CB">Fund settings</S.Value.Medium>
          {isTrader && (
            <S.AppLink
              text="Manage"
              routePath={`/fund-details/${poolData.id}/edit`}
            />
          )}
        </Flex>

        <Flex full ai="center" jc="space-between">
          <S.Label>Minimum investment amount</S.Label>
          <S.Value.Medium color="#E4F2FF">{minimalInvestment}</S.Value.Medium>
        </Flex>
        {emission.unlimited && (
          <Flex full ai="center" jc="space-between">
            <S.Label>Emission</S.Label>
            <S.Value.Medium color="#E4F2FF">{emission.value}</S.Value.Medium>
          </Flex>
        )}
        <Flex full ai="center" jc="space-between">
          <S.Label>Fund managers</S.Label>
          <S.Value.Medium color="#E4F2FF">{adminsCount}</S.Value.Medium>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.Label>Limit who can invest</S.Label>
          <S.Value.Medium color="#E4F2FF">{whitelistCount}</S.Value.Medium>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.Label>Performance Fee</S.Label>
          <S.Value.Medium color="#E4F2FF">
            {commissionPercentage}%
          </S.Value.Medium>
        </Flex>
      </Card>
      {!emission.unlimited && (
        <Card>
          <Flex full ai="center" jc="space-between">
            <Flex ai="center" gap="4">
              <Tooltip id={uuidv4()}>Emmission explain</Tooltip>
              <S.Label>Emission</S.Label>
            </Flex>
            <S.Value.Medium color="#E4F2FF">
              {emissionLeft.value}
            </S.Value.Medium>
          </Flex>
          <S.ProgressBar w={emissionLeft.percentage} />
        </Card>
      )}

      <Card>
        <Flex full ai="center" jc="space-between">
          <S.Value.Medium color="#9AE2CB">Fund description</S.Value.Medium>
          {isTrader && (
            <S.AppLink
              text="Edit"
              routePath={`/fund-details/${poolData.id}/edit`}
            />
          )}
        </Flex>
        <S.Value.MediumThin
          color={!isEmpty(poolMetadata.description) ? "#E4F2FF" : "#B1C7FC"}
        >
          {!isEmpty(poolMetadata.description)
            ? poolMetadata.description
            : "No description provided"}
        </S.Value.MediumThin>

        <Flex full ai="center" jc="space-between">
          <S.Value.Medium color="#9AE2CB">Fund strategy</S.Value.Medium>
        </Flex>
        <S.Value.MediumThin
          color={!isEmpty(poolMetadata.strategy) ? "#E4F2FF" : "#B1C7FC"}
        >
          {!isEmpty(poolMetadata.strategy)
            ? poolMetadata.strategy
            : "No strategy provided"}
        </S.Value.MediumThin>
      </Card>
    </>
  )
}

export default TabPoolInfo
