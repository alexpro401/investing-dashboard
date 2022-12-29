import * as React from "react"
import { useSelector } from "react-redux"
import { useGovPoolProposal } from "hooks/dao"
import * as S from "../../styled"

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
import { usePoolPriceHistoryDiff } from "hooks/usePool"
import { useBreakpoints } from "hooks"
import { ICON_NAMES } from "consts/index"

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

  const { isMobile } = useBreakpoints()

  return (
    <>
      {isLoaded ? (
        <>
          <S.DaoProposalInsurancePoolStatisticCard
            data={poolData}
            isMobile={isMobile}
            hideChart
          />

          <S.DaoProposalInsuranceChartCard>
            <Chart
              type={CHART_TYPE.area}
              height={isMobile ? "110px" : "302px"}
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
          </S.DaoProposalInsuranceChartCard>

          <S.DaoProposalInsurancePoolPriceDiff
            initialPriceUSD={initialPriceUSD}
            currentPriceUSD={currentPriceUSD}
            priceDiffUSD={priceDiffUSD}
          />

          <S.DaoProposalInsuranceDescriptionCard>
            {insuranceProposalView.form.description}
          </S.DaoProposalInsuranceDescriptionCard>

          {isMobile ? (
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
          ) : (
            <S.DaoProposalInsuranceChatLink
              full
              color={"default"}
              iconRight={ICON_NAMES.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              text={"Chat for the discussion"}
              href={insuranceProposalView.form.chat}
            />
          )}
        </>
      ) : (
        <Skeleton variant={"rect"} w={"calc(100%)"} h={"135px"} />
      )}
    </>
  )
}

export default GovPoolProposalInsurance
