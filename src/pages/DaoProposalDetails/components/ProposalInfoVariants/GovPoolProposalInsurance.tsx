import * as React from "react"
import { useSelector } from "react-redux"
import { useGovPoolProposal } from "hooks/dao"
import * as S from "../../styled"

import PoolStatisticCard from "components/cards/PoolStatistic"
import { AppState } from "state"
import { selectPoolByAddress } from "state/pools/selectors"
import { isEmpty, isNil } from "lodash"
import Skeleton from "components/Skeleton"
import { shortenAddress } from "utils"
import theme, { Flex, Text } from "theme"
import ExternalLink from "components/ExternalLink"
import { CHART_TYPE } from "consts/chart"
import Chart from "components/Chart"
import { generatePoolPnlHistory } from "utils/formulas"
import PoolPriceDiff from "components/PoolPriceDiff"
import { usePoolPriceHistoryDiff } from "hooks/usePool"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  govPoolProposal: ReturnType<typeof useGovPoolProposal>
}

const GovPoolProposalInsurance: React.FC<Props> = ({ govPoolProposal }) => {
  const { insuranceProposalView } = govPoolProposal

  const [isLoaded, setIsLoaded] = React.useState(false)
  const [activePoint, setActivePoint] = React.useState({})

  const poolData = useSelector((s: AppState) =>
    selectPoolByAddress(s, insuranceProposalView?.form?.pool)
  )

  const { initialPriceUSD, currentPriceUSD, priceDiffUSD } =
    usePoolPriceHistoryDiff(
      insuranceProposalView?.chart?.point?.payload,
      insuranceProposalView?.insurancePoolLastPriceHistory
    )

  React.useEffect(() => {
    if (!isEmpty(insuranceProposalView) && !isNil(poolData)) {
      setActivePoint(insuranceProposalView.chart.point)

      setIsLoaded(true)
    }
  }, [insuranceProposalView, poolData])

  return (
    <>
      {isLoaded ? (
        <>
          <PoolStatisticCard data={poolData} />

          <S.DaoProposalDetailsCard>
            <Chart
              type={CHART_TYPE.area}
              height={"110px"}
              data={generatePoolPnlHistory(insuranceProposalView.chart.data)}
              activePoint={{
                get: activePoint,
                set: setActivePoint,
              }}
              chart={{
                stackOffset: "silhouette",
              }}
              chartItems={[
                {
                  type: "linear",
                  dataKey: "price",
                  legendType: "triangle",
                  isAnimationActive: false,
                  stroke: theme.statusColors.error,
                },
              ]}
            />
          </S.DaoProposalDetailsCard>

          <PoolPriceDiff
            initialPriceUSD={initialPriceUSD}
            currentPriceUSD={currentPriceUSD}
            priceDiffUSD={priceDiffUSD}
          />

          <S.DaoProposalDetailsCard>
            {insuranceProposalView.form.description}
          </S.DaoProposalDetailsCard>

          <S.DaoProposalDetailsCard>
            <Flex full ai={"center"} jc={"space-between"}>
              <Text fw={600} fz={13} lh={"13px"} color={"#E4F2FF"}>
                Chat for the discussion:
              </Text>
              <ExternalLink
                href={insuranceProposalView.form.chat}
                color={theme.brandColors.secondary}
                fz={"13px"}
                fw={"500"}
              >
                {shortenAddress(insuranceProposalView.form.chat, 12)}
              </ExternalLink>
            </Flex>
          </S.DaoProposalDetailsCard>
        </>
      ) : (
        <Skeleton variant={"rect"} w={"calc(100%)"} h={"135px"} />
      )}
    </>
  )
}

export default GovPoolProposalInsurance
