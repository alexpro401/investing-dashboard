import { FC, useMemo } from "react"
import { v4 as uuidv4 } from "uuid"
import { ButtonContainer, InvestorStatisticValue } from "./styled"
import { Flex, Text, To } from "theme"
import Button, { SecondaryButton } from "components/Button"
import InfoCard from "components/cards/Info"
import Skeleton from "components/Skeleton"
import Avatar from "components/Avatar"
import { Icon } from "common"
import { ICON_NAMES } from "constants/icon-names"

import { useWeb3React } from "@web3-react/core"
import { InvestorPoolQuery } from "interfaces/thegraphs/investors"
import { isEmpty, isNil } from "lodash"
import useInvestorTotalInvest from "hooks/useInvestorTotalInvest"
import { normalizeBigNumber } from "utils"
import useInvestorTV from "hooks/useInvestorTV"
import Tooltip from "components/Tooltip"
import { useUserMetadata } from "state/ipfsMetadata/hooks"

interface Props {
  activePools: InvestorPoolQuery[]
}
const InvestorStatistic: FC<Props> = ({ activePools }) => {
  const { account } = useWeb3React()

  const [{ loading: userLoading, userName, userAvatar }] =
    useUserMetadata(account)
  const [{ usd: totalInvestUSD }, { loading: totalLoading }] =
    useInvestorTotalInvest(account)

  const [{ usd: tvUSD }, { loading: tvLoading }] = useInvestorTV(
    account,
    activePools
  )

  const activePoolsCount = useMemo(() => {
    if (isNil(activePools)) {
      return <Skeleton w="25px" h="16px" />
    }
    return <InvestorStatisticValue>{activePools.length}</InvestorStatisticValue>
  }, [activePools])

  const totalInvested = useMemo(() => {
    if (totalLoading) {
      return <Skeleton w="45px" h="16px" />
    }
    const res = normalizeBigNumber(totalInvestUSD, 18, 2)
    return <InvestorStatisticValue>${res}</InvestorStatisticValue>
  }, [totalInvestUSD, totalLoading])

  const tv = useMemo(() => {
    if (isEmpty(activePools)) {
      return <InvestorStatisticValue>$0.0</InvestorStatisticValue>
    }

    if (tvLoading) {
      return <Skeleton w="45px" h="16px" />
    }

    const res = normalizeBigNumber(tvUSD, 18, 2)
    return <InvestorStatisticValue>${res}</InvestorStatisticValue>
  }, [activePools, tvUSD, tvLoading])

  const userStatistic = useMemo(
    () => [
      {
        label: "Invested",
        value: totalInvested,
      },
      {
        label: "TV",
        value: tv,
      },
      {
        label: "P&L",
        value: <InvestorStatisticValue>12.38%</InvestorStatisticValue>,
      },
      {
        label: "Pools",
        value: activePoolsCount,
      },
    ],
    [totalInvested, tv, activePoolsCount]
  )

  const leftNode = useMemo(() => {
    if (userLoading) {
      return (
        <Flex ai="center" jc="flex-start">
          <Skeleton variant="circle" w="38px" h="38px" />
          <Flex dir="column" ai="flex-start" jc="space-between" m="0 0 0 10px">
            <Skeleton variant="text" h="21px" w="121px" />
            <Skeleton variant="text" h="17px" w="50px" m="4px 0 0" />
          </Flex>
        </Flex>
      )
    }

    return (
      <Flex ai="center" jc="flex-start">
        <Avatar size={38} url={userAvatar} address={account} />
        <Flex p="0 0 0 10px" dir="column" ai="flex-start">
          <Text color="#ffffff">{userName}</Text>
          <Flex full ai="center" jc="flex-start" gap="6">
            <Text fz={12} lh="15px" color="#5a6071">
              Investing
            </Text>{" "}
            <Text fz={12} lh="15px" color="#9AE2CB">
              +2.1%
            </Text>
            <Tooltip id={uuidv4()}>PnL explanation</Tooltip>
          </Flex>
        </Flex>
      </Flex>
    )
  }, [account, userName, userAvatar, userLoading])

  const rightNode = useMemo(
    () => (
      <div style={{ color: "#788AB4" }}>
        <Icon name={ICON_NAMES.share} />
      </div>
    ),
    []
  )

  return (
    <>
      <InfoCard
        nodeHeadLeft={leftNode}
        nodeHeadRight={rightNode}
        statistic={userStatistic}
      >
        <ButtonContainer>
          <To to="/">
            <SecondaryButton full fz={14}>
              New investment
            </SecondaryButton>
          </To>
          <To to="/investment/positions/open">
            <Button full fz={14}>
              My investments
            </Button>
          </To>
        </ButtonContainer>
      </InfoCard>
    </>
  )
}

export default InvestorStatistic
