import * as React from "react"
import { Label } from "recharts"
import { v4 as uuidv4 } from "uuid"
import { useNavigate } from "react-router-dom"
import { isEmpty, isNil, map, reduce } from "lodash"

import { Collapse, Icon } from "common"
import theme, { Flex, Text } from "theme"
import { normalizeBigNumber, shortenAddress } from "utils"
import ExternalLink from "components/ExternalLink"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import * as S from "./styled"
import { CHART_TYPE } from "consts/chart"
import Chart from "components/Chart"
import { ICON_NAMES } from "consts/icon-names"
import ERC721Row from "components/ERC721Row"
import { ZERO } from "consts"
import ERC20Row from "components/ERC20Row"
import { IGovVoterInPoolPairsQuery } from "interfaces/thegraphs/gov-pools"
import { Token } from "interfaces"

import { useGovPoolWithdrawableAssets, useGovPoolDelegations } from "hooks"

import { addBignumbers, subtractBignumbers } from "utils/formulas"
import { BigNumber } from "@ethersproject/bignumber"

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

interface IProps {
  data: IGovVoterInPoolPairsQuery
  chainId?: number
  alwaysShowMore?: boolean
  token: Token | null
  nftsPower: Record<string, BigNumber>
}

const GovTokenDelegationCard: React.FC<IProps> = ({
  data,
  chainId,
  alwaysShowMore,
  token,
  nftsPower,
}) => {
  const navigate = useNavigate()

  const withdrawableAssets = useGovPoolWithdrawableAssets({
    daoPoolAddress: data.from.pool.id,
    delegator: data.from.voter.id,
    delegatee: data.to.voter.id,
  })

  const delegations = useGovPoolDelegations({
    daoPoolAddress: data.from.pool.id,
    user: data.from.voter.id,
  })

  const toExplorerLink = React.useMemo(() => {
    if (isNil(data) || isNil(chainId)) {
      return ""
    }
    return getExplorerLink(chainId, data.to.voter.id, ExplorerDataType.ADDRESS)
  }, [data, chainId])

  const usedInVoting = React.useMemo(() => {
    if (isNil(withdrawableAssets) || isNil(delegations)) {
      return ZERO
    }

    const _currentDelegations = reduce(
      delegations.delegationsInfo,
      (acc, delegation) => {
        if (
          String(delegation.delegatee).toLocaleLowerCase() ===
          String(data.to.voter.id).toLocaleLowerCase()
        ) {
          return addBignumbers([acc, 18], [delegation.delegatedTokens, 18])
        }

        return acc
      },
      ZERO
    )

    return subtractBignumbers(
      [_currentDelegations, 18],
      [withdrawableAssets.tokens, 18]
    )
  }, [withdrawableAssets, delegations])

  const available = React.useMemo(() => {
    if (isNil(withdrawableAssets)) return ZERO
    return withdrawableAssets.tokens
  }, [withdrawableAssets])

  const total = React.useMemo(
    () => addBignumbers([usedInVoting, 18], [available, 18]),
    [usedInVoting, available]
  )

  const chartData = React.useMemo(
    () => [
      {
        name: "Used in voting",
        value: Number(normalizeBigNumber(usedInVoting, 18, 0)),
        fill: theme.brandColors.secondary,
      },
      {
        name: "Available",
        value: Number(normalizeBigNumber(available, 18, 0)),
        fill: theme.statusColors.success,
      },
    ],
    [usedInVoting, available]
  )

  const _showMore = React.useState(!isNil(alwaysShowMore))

  const onUndelegationTerminalNavigate = React.useCallback(() => {
    navigate(`/dao/${data.from.pool.id}/undelegate/${data.to.voter.id}`)
  }, [data.from.pool.id, data.to.voter.id])

  const onDelegationTerminalNavigate = React.useCallback(() => {
    navigate(`/dao/${data.from.pool.id}/delegate/${data.to.voter.id}`)
  }, [data.from.pool.id, data.to.voter.id])

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
            {shortenAddress(data.to.voter.id, 4)}
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
                  total={normalizeBigNumber(total, 18, 3)}
                />
              )}
            ></Label>
          </Chart>
        </S.ChartContainer>
        <Flex full>
          <Text color={theme.textColors.primary} fz={13}>
            <S.LegendDot color={theme.brandColors.secondary} />
            Used in Voting: {normalizeBigNumber(usedInVoting, 18, 3)}
          </Text>
          <Text color={theme.textColors.primary} fz={13}>
            <S.LegendDot color={theme.statusColors.success} />
            Available: {normalizeBigNumber(available, 18, 3)}
          </Text>
        </Flex>
        <div>
          <Collapse isOpen={_showMore[0]}>
            <Flex full dir={"column"} gap={"8"} m={"18px 0 16px"}>
              {!isEmpty(data.delegateNfts) &&
                map(data.delegateNfts, (nft) => (
                  <ERC721Row
                    key={uuidv4()}
                    isLocked
                    votingPower={nftsPower[nft.toString()] ?? ZERO}
                    tokenId={nft.toString()}
                    tokenUri="https://public.nftstatic.com/static/nft/res/nft-cex/S3/1664823519694_jkjs8973ujyphjznjmmjd5h88tay9e0x.png"
                  />
                ))}
              {BigNumber.from(data.delegateAmount).gt(0) && (
                <ERC20Row
                  isLocked
                  delegated={data.delegateAmount}
                  available={withdrawableAssets?.tokens ?? ZERO}
                  tokenId={token?.address ?? ""}
                  tokenUri=""
                />
              )}
            </Flex>
            <S.ActionBase
              onClick={onUndelegationTerminalNavigate}
              text={"Withdraw available"}
            />
            <S.ActionSecondary
              onClick={onDelegationTerminalNavigate}
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
