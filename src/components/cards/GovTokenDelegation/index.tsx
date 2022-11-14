import * as React from "react"
import { Card, Collapse, Icon } from "common"
import theme, { Flex, Text } from "theme"
import { shortenAddress } from "utils"
import ExternalLink from "components/ExternalLink"
import { isNil } from "lodash"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { Label } from "recharts"
import * as S from "./styled"
import { CHART_TYPE } from "constants/chart"
import Chart from "components/Chart"
import { ICON_NAMES } from "constants/icon-names"

const chartData = [
  {
    name: "Used in voting",
    value: 75000,
    fill: theme.brandColors.secondary,
  },
  {
    name: "Available",
    value: 25000,
    fill: theme.statusColors.success,
  },
]

const CustomLabel = ({ viewBox, total }) => {
  const { cx, cy } = viewBox
  return (
    <svg
      className="recharts-text recharts-label"
      textAnchor="middle"
      dominantBaseline="central"
    >
      <text x={cx} y={cy - 10} fill={theme.textColors.primary}>
        <tspan
          x={cx}
          dy="0em"
          alignmentBaseline="middle"
          fontSize="20"
          fontWeight={600}
        >
          {total}
        </tspan>
      </text>
    </svg>
  )
}

const GovTokenDelegationCard: React.FC<{
  data: any
  chainId?: number
  alwaysShowMore?: boolean
}> = ({ data, chainId, alwaysShowMore }) => {
  const toExplorerLink = React.useMemo(() => {
    if (isNil(data) || isNil(chainId)) {
      return ""
    }
    return getExplorerLink(chainId, data.to.id, ExplorerDataType.ADDRESS)
  }, [data, chainId])

  const _showMore = React.useState(
    !isNil(alwaysShowMore) ? alwaysShowMore : false
  )

  const CollapseTrigger = React.useMemo(() => {
    if (isNil(alwaysShowMore) || !alwaysShowMore) {
      return (
        <S.CollapseButton onClick={() => _showMore[1]((p) => !p)}>
          <Icon
            name={_showMore[0] ? ICON_NAMES.angleUp : ICON_NAMES.angleDown}
          />
        </S.CollapseButton>
      )
    }
    return null
  }, [alwaysShowMore, _showMore])

  return (
    <S.Container>
      <S.Content>
        <Flex full ai="center" jc="space-between">
          <Text fw={500} fz={13} color={theme.textColors.secondary}>
            Delegated to
          </Text>
          <ExternalLink href={toExplorerLink} color={theme.textColors.primary}>
            {shortenAddress(data.to.id, 4)}
          </ExternalLink>
        </Flex>
        <S.ChartContainer>
          <Chart
            type={CHART_TYPE.straightAnglePie}
            height={"80px"}
            data={chartData}
            chart={{ layout: "centric" }}
            chartItems={[
              {
                dataKey: "value",
                outerRadius: 70,
                innerRadius: 60,
                cornerRadius: 10,
                strokeWidth: 0,
                paddingAngle: 2,
              },
            ]}
          >
            <Label
              position="center"
              content={(p) => (
                <CustomLabel
                  viewBox={p.viewBox}
                  total={chartData[0].value + chartData[1].value}
                />
              )}
            ></Label>
          </Chart>
        </S.ChartContainer>
        <Flex full>
          <Text color={theme.textColors.primary} fz={13}>
            <S.LegendDot color={theme.brandColors.secondary} />
            Used in Voting: 75,000
          </Text>
          <Text color={theme.textColors.primary} fz={13}>
            <S.LegendDot color={theme.statusColors.success} />
            Available: 25,000
          </Text>
        </Flex>
        <div>
          <Collapse isOpen={_showMore[0]}>
            <div>
              <Card>First asset</Card>
              <Card>Second asset</Card>
              <Card>Third asset</Card>
            </div>
            <S.ActionBase
              onClick={() => alert("Wanna withdraw from DAO pool? 😑")}
              text={"Withdraw available"}
            />
            <S.ActionSecondary
              onClick={() => alert("Yes, do it one more time 🫡")}
              text={"Delegate more"}
            />
          </Collapse>

          {CollapseTrigger}
        </div>
      </S.Content>
    </S.Container>
  )
}

export default GovTokenDelegationCard
