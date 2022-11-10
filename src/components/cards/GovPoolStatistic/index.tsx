import { FC, ReactNode, useEffect, useMemo, useState } from "react"
import { isEmpty, isFunction, isNil } from "lodash"

import { Flex } from "theme"
import { CardInfo } from "common"
import Icon from "components/Icon"
import Skeleton from "components/Skeleton"

import * as S from "./styled"

import { normalizeBigNumber } from "utils"
import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"
import useGovPoolVotingAssets from "hooks/dao/useGovPoolVotingAssets"
import useGovPoolUserVotingPower from "hooks/dao/useGovPoolUserVotingPower"
import useGovPoolStatistic from "hooks/dao/useGovPoolStatistic"
import useGovPoolIpfsData from "hooks/dao/useGovPoolIpfsData"

const HeadLeftNodeSkeleton: FC = () => (
  <Flex ai="center" jc="flex-start">
    <Skeleton variant="circle" w="38px" h="38px" />
    <Flex dir="column" ai="flex-start" m="0 0 0 8px" gap="4">
      <Skeleton variant="text" h="20px" w="121px" />
      <Skeleton variant="text" h="16px" w="50px" />
    </Flex>
  </Flex>
)

function getStatisticNode(s, formatter) {
  if (s.loading) return <Skeleton variant="text" h="16px" w="70px" />

  const formattedValue =
    isNil(formatter) || !isFunction(formatter)
      ? normalizeBigNumber(s.value, 18, 0)
      : formatter(s.value)

  return <S.StatisticValue>{formattedValue}</S.StatisticValue>
}

interface Props {
  data: IGovPoolQuery
  account?: string | null
  index?: number
  children?: ReactNode
}

const GovPoolStatisticCard: FC<Props> = ({
  data,
  account,
  index = 0,
  children,
}) => {
  const [UserVotingPower, UserVotingPowerLoading] = useGovPoolUserVotingPower({
    daoAddress: data.id,
    address: account,
  })
  const [assetsExisting, assets] = useGovPoolVotingAssets(data.id)
  const [statistic] = useGovPoolStatistic(data.id)
  const [ipfs, ipfsLoading] = useGovPoolIpfsData(data.id)

  const userVotingPower = useMemo(() => {
    if (UserVotingPowerLoading) {
      return <Skeleton variant="text" h="16px" w="70px" />
    }
    return normalizeBigNumber(UserVotingPower.total, 18, 0)
  }, [UserVotingPower, UserVotingPowerLoading])

  const userStatistic = useMemo(
    () => [
      {
        label: "TVL",
        value: getStatisticNode(
          statistic.tvl,
          (v) => `$${normalizeBigNumber(v, 18, 2)}`
        ),
        info: <>Info about TVL</>,
      },
      {
        label: "MC/TVL",
        value: getStatisticNode(statistic.mc_tvl, (v) =>
          normalizeBigNumber(v, 18, 2)
        ),
        info: <>Info about MC/TVL</>,
      },
      {
        label: "Members",
        value: getStatisticNode(statistic.members, (v) => String(v)),
        info: <>Info about Members</>,
      },
      {
        label: "LAU",
        value: getStatisticNode(
          statistic.lau,
          (v) => `${normalizeBigNumber(v, 18, 0)}%`
        ),
        info: <>Info about LAU</>,
      },
    ],
    [statistic]
  )

  const leftNode = useMemo(() => {
    if (!data || !assets.token || !assets.nft || ipfsLoading) {
      return <HeadLeftNodeSkeleton />
    }

    const iconSource = !ipfs || !ipfs.avatarUrl ? "" : ipfs.avatarUrl

    const name =
      String(data.name).length > 20
        ? String(data.name).slice(0, 18) + "..."
        : data.name

    let subTitle = ""
    if (assetsExisting.haveToken) {
      subTitle += `${assets.token?.symbol} `
    }
    if (assetsExisting.haveNft) {
      if (!isEmpty(subTitle)) {
        subTitle += "& "
      }
      subTitle += "NFT"
    }

    return (
      <Flex ai="center" jc="flex-start">
        <Icon size={38} m="0 8px 0 0" source={iconSource} address={data.id} />
        <Flex dir="column" ai="flex-start" gap="4">
          <S.Title>{name ?? "111PG DAO"}</S.Title>
          <S.Description align="left">{subTitle}</S.Description>
        </Flex>
      </Flex>
    )
  }, [data, assetsExisting, assets, ipfs, ipfsLoading])

  const rightNode = useMemo(() => {
    return (
      <Flex ai="flex-end" jc="flex-start" dir="column" gap="4">
        <S.VotingPowerValue>{userVotingPower}</S.VotingPowerValue>
        <S.Description>My voting power</S.Description>
      </Flex>
    )
  }, [userVotingPower])

  return (
    <S.Animation index={index}>
      <CardInfo
        nodeHeadLeft={leftNode}
        nodeHeadRight={rightNode}
        statistic={userStatistic}
      >
        {children}
      </CardInfo>
    </S.Animation>
  )
}

export default GovPoolStatisticCard
