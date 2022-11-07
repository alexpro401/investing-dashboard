import { FC, ReactNode, useMemo } from "react"

import { Flex } from "theme"
import { CardInfo } from "common"
import Icon from "components/Icon"
import Skeleton from "components/Skeleton"

import * as S from "./styled"

const HeadLeftNodeSkeleton: FC = () => (
  <Flex ai="center" jc="flex-start">
    <Skeleton variant="circle" w="38px" h="38px" />
    <Flex dir="column" ai="flex-start" jc="space-between" m="0 0 0 10px">
      <Skeleton variant="text" h="21px" w="121px" />
      <Skeleton variant="text" h="17px" w="50px" m="4px 0 0" />
    </Flex>
  </Flex>
)

interface Props {
  index?: number
  children?: ReactNode
}

const GovPoolStatisticCard: FC<Props> = ({ index = 0, children }) => {
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
    // if (!data) return <HeadLeftNodeSkeleton />

    return (
      <Flex ai="center" jc="flex-start">
        <Icon size={38} m="0 8px 0 0" source={""} address={""} />
        <div>
          <S.Title>111PG DAO</S.Title>
          <S.Description align="left">111PG tokens & NFT</S.Description>
        </div>
      </Flex>
    )
  }, [])

  const rightNode = useMemo(() => {
    return (
      <Flex ai="flex-end" jc="flex-start" dir="column">
        <S.VotingPowerValue>8878</S.VotingPowerValue>
        <S.Description>My voting power</S.Description>
      </Flex>
    )
  }, [])

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
