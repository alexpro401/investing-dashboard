import { FC, useMemo } from "react"
import { v4 as uuidv4 } from "uuid"
import * as S from "./styled"
import { Flex, Text } from "theme"
import { CardInfo } from "common"
import Skeleton from "components/Skeleton"
import AccountInfo from "components/AccountInfo"
import { Icon } from "common"
import { ICON_NAMES } from "consts/icon-names"

import { useWeb3React } from "@web3-react/core"
import { InvestorPoolQuery } from "interfaces/thegraphs/investors"
import { isEmpty, isNil } from "lodash"
import useInvestorTotalInvest from "hooks/useInvestorTotalInvest"
import { normalizeBigNumber } from "utils"
import useInvestorTV from "hooks/useInvestorTV"
import Tooltip from "components/Tooltip"
import { useBreakpoints } from "../../../hooks"

interface Props {
  activePools: InvestorPoolQuery[]
}
const InvestorStatisticCard: FC<Props> = ({ activePools }) => {
  const { isMobile } = useBreakpoints()

  const { account } = useWeb3React()

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
    return (
      <S.InvestorStatisticValue>{activePools.length}</S.InvestorStatisticValue>
    )
  }, [activePools])

  const totalInvested = useMemo(() => {
    if (totalLoading) {
      return <Skeleton w="45px" h="16px" />
    }
    const res = normalizeBigNumber(totalInvestUSD, 18, 2)
    return <S.InvestorStatisticValue>${res}</S.InvestorStatisticValue>
  }, [totalInvestUSD, totalLoading])

  const tv = useMemo(() => {
    if (isEmpty(activePools)) {
      return <S.InvestorStatisticValue>$0.0</S.InvestorStatisticValue>
    }

    if (tvLoading) {
      return <Skeleton w="45px" h="16px" />
    }

    const res = normalizeBigNumber(tvUSD, 18, 2)
    return <S.InvestorStatisticValue>${res}</S.InvestorStatisticValue>
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
        value: <S.InvestorStatisticValue>12.38%</S.InvestorStatisticValue>,
      },
      {
        label: "Pools",
        value: activePoolsCount,
      },
    ],
    [totalInvested, tv, activePoolsCount]
  )

  const leftNode = useMemo(
    () => (
      <AccountInfo account={account}>
        <Flex full ai="center" jc="flex-start" gap="6">
          <Text fz={12} lh="15px" color="#5a6071">
            Investing
          </Text>{" "}
          <Text fz={12} lh="15px" color="#9AE2CB">
            +2.1%
          </Text>
          <Tooltip id={uuidv4()}>PnL explanation</Tooltip>
        </Flex>
      </AccountInfo>
    ),

    [account, isMobile]
  )

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
      <CardInfo
        nodeHeadLeft={leftNode}
        nodeHeadRight={rightNode}
        statistic={userStatistic}
      >
        <S.ButtonContainer>
          <S.NewInvestment text={"+ New investment"} routePath="/" />
          <S.MyInvestments
            text={"My investments"}
            routePath="/investment/positions/open"
          />
        </S.ButtonContainer>
      </CardInfo>
    </>
  )
}

export default InvestorStatisticCard
