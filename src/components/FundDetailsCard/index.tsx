import { FC, ReactNode, useState, useEffect, useMemo } from "react"
import { formatEther } from "@ethersproject/units"
import { format } from "date-fns"

import { useERC20 } from "hooks/useContract"
import { IPoolQuery, PoolInfo } from "constants/interfaces_v2"
import { expandTimestamp, formatBigNumber } from "utils"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { DATE_FORMAT } from "constants/time"

import Emission from "components/Emission"
import ReadMore from "components/ReadMore"

import {
  Label,
  DescriptionText,
  Container,
  InfoRow,
  EmptyDescription,
} from "./styled"

function percentage(used, total) {
  return (used / total) * 100
}

const fundTypes = {
  BASIC_POOL: "Basic",
  INVEST_POOL: "Invest",
}

interface Props {
  pool: IPoolQuery
  poolInfo: PoolInfo | null
  children?: ReactNode | null
}

const FundDetailsCard: FC<Props> = ({ pool, poolInfo, children = null }) => {
  const [description, setDescription] = useState("")
  const [strategy, setStrategy] = useState("")
  const [, baseToken] = useERC20(pool.baseToken)

  const [{ poolMetadata }] = usePoolMetadata(pool.id, pool.descriptionURL)

  const creationTime = useMemo(() => {
    if (!!pool) {
      return format(expandTimestamp(pool.creationTime), DATE_FORMAT)
    }

    return "-"
  }, [pool])

  const minimalInvestment = useMemo(() => {
    if (!poolInfo || !baseToken) return "-"

    const res = formatEther(poolInfo.parameters.minimalInvestment)

    if (res === "0.0" || res === "0.00") {
      return "-"
    }
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

    return {
      percentage: percent,
      value: formatBigNumber(dif, 18, 6),
    }
  }, [poolInfo, emission])

  const whitelistCount = useMemo(() => {
    if (!pool) return 0
    return pool.privateInvestors.length
  }, [pool])

  const adminsCount = useMemo(() => {
    if (!pool) return 0
    return pool.admins.length
  }, [pool])

  useEffect(() => {
    if (!poolMetadata) return

    setDescription(poolMetadata.description)
    setStrategy(poolMetadata.strategy)
  }, [poolMetadata])

  return (
    <Container>
      <Label>Fund description</Label>
      {!description ? (
        <EmptyDescription>
          Add a description of your fund for investors.
        </EmptyDescription>
      ) : (
        <DescriptionText>
          <ReadMore content={description} />
        </DescriptionText>
      )}
      <Label>Fund strategy</Label>
      {!strategy ? (
        <EmptyDescription>
          Add a strategy of your fund for investors.
        </EmptyDescription>
      ) : (
        <DescriptionText>
          <ReadMore content={strategy} />
        </DescriptionText>
      )}

      {!emission.unlimited && (
        <Emission
          percent={emissionLeft.percentage}
          total={`${emission.value} ${pool.ticker}`}
          current={`${emissionLeft.value} ${pool.ticker}`}
        />
      )}
      <InfoRow label={"Creation date"} value={creationTime} />
      <InfoRow label={"Type of fund"} value={fundTypes[pool.type]} />
      <InfoRow label={"Min. investment amount"} value={minimalInvestment} />
      <InfoRow label={"Whitelist"} value={`${whitelistCount} adresess`} />
      <InfoRow label={"Fund manager"} value={`${adminsCount} managers`} />
      {emission.unlimited && (
        <InfoRow label={"Emission"} value={emission.value} />
      )}
      {children}
    </Container>
  )
}

export default FundDetailsCard
