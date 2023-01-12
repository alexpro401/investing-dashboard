import { FC, useMemo } from "react"
import { v4 as uuidv4 } from "uuid"
import { formatEther } from "@ethersproject/units"

import { IPoolQuery } from "interfaces/thegraphs/all-pools"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"
import * as S from "./styled"
import { Card } from "common"
import { Flex } from "theme"
import { format } from "date-fns"
import { expandTimestamp, formatBigNumber, shortenAddress } from "utils"
import { DATE_FORMAT } from "consts/time"
import { Token } from "interfaces"
import Tooltip from "components/Tooltip"
import { isEmpty } from "lodash"

function percentage(used, total) {
  return (used / total) * 100
}

const fundTypes = {
  BASIC_POOL: "Basic",
  INVEST_POOL: "Invest",
}

interface Props {
  data: IPoolQuery
  poolInfo: IPoolInfo | null
  poolMetadata: any
  baseToken: Token | null
  isTrader: boolean
}

const TabPoolInfo: FC<Props> = ({
  data,
  poolInfo,
  poolMetadata,
  baseToken,
  isTrader,
}) => {
  const creationTime = useMemo(() => {
    if (!!data) {
      return format(expandTimestamp(data.creationTime), DATE_FORMAT)
    }

    return "-"
  }, [data])

  const minimalInvestment = useMemo(() => {
    if (!poolInfo || !baseToken) return "0"

    const res = formatEther(poolInfo.parameters.minimalInvestment)

    return `${res} ${baseToken.symbol}`
  }, [poolInfo, baseToken])

  const emission = useMemo(() => {
    if (!poolInfo) return { unlimited: true, value: "Unlimited" }

    const value = formatBigNumber(poolInfo.parameters.totalLPEmission, 18, 6)
    const unlimited = value === "0.0" || value === "0.00"

    return { unlimited, value: unlimited ? "Unlimited" : value }
  }, [poolInfo])

  const emissionLeft = useMemo(() => {
    if (!poolInfo || emission.unlimited)
      return {
        percentage: 0,
        value: "0.0",
      }

    const total = poolInfo.parameters.totalLPEmission
    const used = poolInfo.lpSupply.add(poolInfo.lpLockedInProposals)

    const dif = total.sub(used)

    const percent = percentage(
      Number(formatEther(used)).toFixed(2),
      Number(formatEther(total)).toFixed(2)
    )

    console.log({ percent, value: formatBigNumber(dif, 18, 6) })

    return {
      percentage: percent,
      value: formatBigNumber(dif, 18, 6),
    }
  }, [poolInfo, emission])

  const adminsCount = useMemo(() => {
    if (!data) return 0
    return data.admins.length
  }, [data])

  const whitelistCount = useMemo(() => {
    if (!data) return "off"
    return data.privateInvestors.length > 0
      ? `${data.privateInvestors.length} addresses`
      : "off"
  }, [data])

  const commissionPercentage = useMemo<string>(() => {
    if (!poolInfo) return "0"
    return formatBigNumber(poolInfo.parameters.commissionPercentage, 25, 0)
  }, [poolInfo])

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
            {shortenAddress(data.id, 2)}
          </S.Value.Medium>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.Label>Basic token</S.Label>
          <S.Value.Medium color="#E4F2FF">{baseToken?.symbol}</S.Value.Medium>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.Label>Fund ticker</S.Label>
          <S.Value.Medium color="#E4F2FF">{data.ticker}</S.Value.Medium>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.Label>Fund name</S.Label>
          <S.Value.Medium color="#E4F2FF">{data.name}</S.Value.Medium>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <S.Label>Type of fund</S.Label>
          <S.Value.Medium color="#E4F2FF">
            {fundTypes[data.type]}
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
              routePath={`/fund-details/${data.id}/edit`}
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
              routePath={`/fund-details/${data.id}/edit`}
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
