import { FC, useMemo } from "react"
import { v4 as uuidv4 } from "uuid"
import { formatEther } from "@ethersproject/units"

import { IPoolQuery } from "interfaces/thegraphs/all-pools"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"
import { AppLink, Label, ProgressBar, Value } from "../styled"
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
        <Value.Medium color="#9AE2CB">Information</Value.Medium>
        <Flex full ai="center" jc="space-between">
          <Label>Creation date</Label>
          <Value.Medium color="#E4F2FF">{creationTime}</Value.Medium>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <Label>Fund address</Label>
          <Value.Medium color="#E4F2FF">
            {shortenAddress(data.id, 2)}
          </Value.Medium>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <Label>Basic token</Label>
          <Value.Medium color="#E4F2FF">{baseToken?.symbol}</Value.Medium>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <Label>Fund ticker</Label>
          <Value.Medium color="#E4F2FF">{data.ticker}</Value.Medium>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <Label>Fund name</Label>
          <Value.Medium color="#E4F2FF">{data.name}</Value.Medium>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <Label>Type of fund</Label>
          <Value.Medium color="#E4F2FF">{fundTypes[data.type]}</Value.Medium>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <Label></Label>
          <Value.Medium color="#E4F2FF"></Value.Medium>
        </Flex>
      </Card>

      <Card>
        <Flex full ai="center" jc="space-between">
          <Value.Medium color="#9AE2CB">Fund settings</Value.Medium>
          {isTrader && (
            <AppLink
              text="Manage"
              routePath={`/fund-details/${data.id}/edit`}
            />
          )}
        </Flex>

        <Flex full ai="center" jc="space-between">
          <Label>Minimum investment amount</Label>
          <Value.Medium color="#E4F2FF">{minimalInvestment}</Value.Medium>
        </Flex>
        {emission.unlimited && (
          <Flex full ai="center" jc="space-between">
            <Label>Emission</Label>
            <Value.Medium color="#E4F2FF">{emission.value}</Value.Medium>
          </Flex>
        )}
        <Flex full ai="center" jc="space-between">
          <Label>Fund managers</Label>
          <Value.Medium color="#E4F2FF">{adminsCount}</Value.Medium>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <Label>Limit who can invest</Label>
          <Value.Medium color="#E4F2FF">{whitelistCount}</Value.Medium>
        </Flex>
        <Flex full ai="center" jc="space-between">
          <Label>Performance Fee</Label>
          <Value.Medium color="#E4F2FF">{commissionPercentage}%</Value.Medium>
        </Flex>
      </Card>
      {!emission.unlimited && (
        <Card>
          <Flex full ai="center" jc="space-between">
            <Flex ai="center" gap="4">
              <Tooltip id={uuidv4()}>Emmission explain</Tooltip>
              <Label>Emission</Label>
            </Flex>
            <Value.Medium color="#E4F2FF">{emissionLeft.value}</Value.Medium>
          </Flex>
          <ProgressBar w={emissionLeft.percentage} />
        </Card>
      )}

      <Card>
        <Flex full ai="center" jc="space-between">
          <Value.Medium color="#9AE2CB">Fund description</Value.Medium>
          {isTrader && (
            <AppLink text="Edit" routePath={`/fund-details/${data.id}/edit`} />
          )}
        </Flex>
        <Value.MediumThin
          color={!isEmpty(poolMetadata.description) ? "#E4F2FF" : "#B1C7FC"}
        >
          {!isEmpty(poolMetadata.description)
            ? poolMetadata.description
            : "No description provided"}
        </Value.MediumThin>

        <Flex full ai="center" jc="space-between">
          <Value.Medium color="#9AE2CB">Fund strategy</Value.Medium>
        </Flex>
        <Value.MediumThin
          color={!isEmpty(poolMetadata.strategy) ? "#E4F2FF" : "#B1C7FC"}
        >
          {!isEmpty(poolMetadata.strategy)
            ? poolMetadata.strategy
            : "No strategy provided"}
        </Value.MediumThin>
      </Card>
    </>
  )
}

export default TabPoolInfo
