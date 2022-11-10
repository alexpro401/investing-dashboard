import { FC, ReactNode, useMemo } from "react"

import { Flex } from "theme"
import { CardInfo } from "common"
import Icon from "components/Icon"
import Skeleton from "components/Skeleton"

import * as S from "./styled"

import { normalizeBigNumber } from "utils"
import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"
import useGovPoolVotingAssets from "hooks/dao/useGovPoolVotingAssets"
import useGovPoolUserVotingPower from "hooks/dao/useGovPoolUserVotingPower"
import { isEmpty } from "lodash"

const HeadLeftNodeSkeleton: FC = () => (
  <Flex ai="center" jc="flex-start">
    <Skeleton variant="circle" w="38px" h="38px" />
    <Flex dir="column" ai="flex-start" m="0 0 0 8px" gap="4">
      <Skeleton variant="text" h="20px" w="121px" />
      <Skeleton variant="text" h="16px" w="50px" />
    </Flex>
  </Flex>
)

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

  const userVotingPower = useMemo(() => {
    if (UserVotingPowerLoading) {
      return <Skeleton variant="text" h="16px" w="70px" />
    }
    return normalizeBigNumber(UserVotingPower.total, 18, 0)
  }, [UserVotingPower, UserVotingPowerLoading])

  const TVL = useMemo(() => {
    // if (isNil(lastHistoryPoint)) {
    //   return <Skeleton w="25px" h="16px" />
    // }

    return <S.StatisticValue>${24888}</S.StatisticValue>
  }, [])

  const MC_TVL = useMemo(() => {
    // if (isNil(lastHistoryPoint)) {
    //   return <Skeleton w="25px" h="16px" />
    // }

    return <S.StatisticValue>{0.9421}</S.StatisticValue>
  }, [])

  const Members = useMemo(() => {
    // if (isNil(lastHistoryPoint)) {
    //   return <Skeleton w="25px" h="16px" />
    // }

    return <S.StatisticValue>{24888}</S.StatisticValue>
  }, [])

  const LAU = useMemo(() => {
    // if (isNil(data)) return <Skeleton w="25px" h="16px" />

    return <S.StatisticValue>{10}%</S.StatisticValue>
  }, [])

  const userStatistic = useMemo(
    () => [
      {
        label: "TVL",
        value: TVL,
        info: <>Info about TVL</>,
      },
      {
        label: "MC/TVL",
        value: MC_TVL,
        info: <>Info about MC/TVL</>,
      },
      {
        label: "Members",
        value: Members,
        info: <>Info about Members</>,
      },
      {
        label: "LAU",
        value: LAU,
        info: <>Info about LAU</>,
      },
    ],
    [TVL, MC_TVL, Members, LAU]
  )

  const leftNode = useMemo(() => {
    if (!data || !assets.token || !assets.nft) return <HeadLeftNodeSkeleton />

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
        <Icon size={38} m="0 8px 0 0" source={""} address={""} />
        <Flex dir="column" ai="flex-start" gap="4">
          <S.Title>{name ?? "111PG DAO"}</S.Title>
          <S.Description align="left">{subTitle}</S.Description>
        </Flex>
      </Flex>
    )
  }, [data, assetsExisting, assets])

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
