import * as React from "react"
import { Collapse, Icon } from "common"
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
import ERC721Row from "components/ERC721Row"
import { ZERO } from "constants/index"
import ERC20Row from "components/ERC20Row"
import { parseEther } from "@ethersproject/units"

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
      <text x={cx} y={cy - 20} fill={theme.textColors.primary}>
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
            chart={{ layout: "centric", height: 80 }}
            chartItems={[
              {
                dataKey: "value",
                outerRadius: 75,
                innerRadius: 65,
                cornerRadius: 10,
                strokeWidth: 0,
                paddingAngle: 2,
                cy: "100%",
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
            <Flex full dir={"column"} gap={"8"} m={"18px 0 16px"}>
              <ERC721Row
                isLocked
                votingPower={ZERO}
                tokenId="0"
                tokenUri="https://public.nftstatic.com/static/nft/res/nft-cex/S3/1664823519694_jkjs8973ujyphjznjmmjd5h88tay9e0x.png"
              />
              <ERC721Row
                votingPower={ZERO}
                tokenId="1"
                tokenUri="https://public.nftstatic.com/static/nft/res/nft-cex/S3/1664823519694_jkjs8973ujyphjznjmmjd5h88tay9e0x.png"
              />
              <ERC20Row
                isLocked
                delegated={parseEther("23000.2314")}
                available={parseEther("2700.123")}
                tokenId="0x78867bbeef44f2326bf8ddd1941a4439382ef2a7"
                tokenUri=""
              />
            </Flex>
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
