import * as S from "./styled"

import { isNil } from "lodash"
import * as React from "react"

import { Flex } from "theme"
import Icon from "components/Icon"
import { normalizeBigNumber } from "utils"
import { useGovPoolDescription, useGovPoolHelperContracts } from "hooks/dao"
import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"
import useGovPoolStatistic from "hooks/dao/useGovPoolStatistic"
import useGovPoolVotingAssets from "hooks/dao/useGovPoolVotingAssets"
import useGovPoolUserVotingPower from "hooks/dao/useGovPoolUserVotingPower"
import { CardInfo } from "common"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  data: IGovPoolQuery
  account?: string | null
  children?: React.ReactNode
  isMobile: boolean
}

const DaoPoolCard: React.FC<Props> = ({
  data,
  account,
  children,
  isMobile,
  ...rest
}) => {
  const id = React.useMemo(() => data?.id ?? "", [data])

  const { descriptionObject } = useGovPoolDescription(id)
  const [assetsExisting, assets] = useGovPoolVotingAssets(id)
  const [govPoolStatistic] = useGovPoolStatistic(data)
  const { govUserKeeperAddress } = useGovPoolHelperContracts(id ?? "")
  const [userVotingPower] = useGovPoolUserVotingPower({
    userKeeperAddress: govUserKeeperAddress,
    address: account,
  })

  const poolName = React.useMemo(() => {
    if (isNil(data)) return ""

    return String(data.name).length > 20
      ? String(data.name).slice(0, 18) + "..."
      : data.name ?? ""
  }, [data])

  const poolAssets = React.useMemo(() => {
    let subTitle = ""

    if (assetsExisting.haveToken) {
      subTitle = `${assets.token?.symbol} `
    }
    if (assetsExisting.haveNft) {
      if (subTitle.length > 0) {
        subTitle += "& "
      }
      subTitle += "NFT"
    }

    return subTitle
  }, [assetsExisting, assets])

  const nodeHeadLeft = React.useMemo(
    () => (
      <Flex ai="center" jc="flex-start">
        <Icon
          size={isMobile ? 38 : 100}
          m="0 8px 0 0"
          address={data?.id}
          source={descriptionObject?.avatarUrl ?? ""}
        />
        <Flex dir="column" ai="flex-start" gap="4">
          <S.DaoPoolCardTitle>{poolName}</S.DaoPoolCardTitle>
          <S.DaoPoolCardDescription align="left">
            {poolAssets}
          </S.DaoPoolCardDescription>
        </Flex>
      </Flex>
    ),
    [data, descriptionObject, isMobile]
  )
  const nodeHeadRight = React.useMemo(
    () => (
      <Flex ai="flex-end" jc="flex-start" dir="column" gap="4">
        <S.DaoPoolCardVotingPower>
          {normalizeBigNumber(userVotingPower.power, 18, 0)}
        </S.DaoPoolCardVotingPower>
        <S.DaoPoolCardDescription>My voting power</S.DaoPoolCardDescription>
      </Flex>
    ),
    [userVotingPower]
  )

  const statistic = React.useMemo(
    () => [
      {
        label: "TVL",
        value: <>${normalizeBigNumber(govPoolStatistic.tvl.value, 18, 2)}</>,
        info: "Info about TVL",
      },
      {
        label: "MC/TVL",
        value: <>{normalizeBigNumber(govPoolStatistic.mc_tvl.value, 18, 2)}</>,
        info: "Info about MC/TVL",
      },
      {
        label: "Members",
        value: <>{String(govPoolStatistic.members.value ?? 0)}</>,
        info: "Info about Members",
      },
      {
        label: "LAU",
        value: <>{normalizeBigNumber(govPoolStatistic.lau.value, 18, 0)}</>,
        info: "Info about LAU",
      },
    ],
    [govPoolStatistic]
  )

  return (
    <CardInfo
      nodeHeadLeft={nodeHeadLeft}
      nodeHeadRight={nodeHeadRight}
      statistic={statistic}
      isMobile={isMobile}
      {...rest}
    >
      {children}
    </CardInfo>
  )
}

export default React.memo(DaoPoolCard)
