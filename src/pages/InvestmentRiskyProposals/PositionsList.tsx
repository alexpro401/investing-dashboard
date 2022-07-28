import { FC, useMemo } from "react"
import { PulseSpinner } from "react-spinners-kit"
import { createClient, Provider as GraphProvider } from "urql"

import { useActiveWeb3React } from "hooks"
import { usePoolContract } from "hooks/usePool"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { IRiskyPositionCard } from "constants/interfaces_v2"
import useInvestorRiskyPositions from "hooks/useInvestorRiskyPositions"

import RiskyPositionCard from "components/cards/position/Risky"

import S from "./styled"

const poolsClient = createClient({
  url: process.env.REACT_APP_BASIC_POOLS_API_URL || "",
})

interface IRiskyCardInitializer {
  account: string
  poolAddress: string
  position: IRiskyPositionCard
}

const RiskyPositionCardInitializer: FC<IRiskyCardInitializer> = ({
  account,
  poolAddress,
  position,
}) => {
  const [, poolInfo] = usePoolContract(poolAddress)

  const [{ poolMetadata }] = usePoolMetadata(
    poolAddress,
    poolInfo?.parameters.descriptionURL
  )

  const isTrader = useMemo<boolean>(() => {
    if (!account || !poolInfo) {
      return false
    }

    return account === poolInfo.parameters.trader
  }, [account, poolInfo])

  if (!position || !poolInfo || !poolMetadata) {
    return null
  }

  return (
    <RiskyPositionCard
      position={position}
      isTrader={isTrader}
      poolInfo={poolInfo}
      poolMetadata={poolMetadata}
    />
  )
}

interface IProps {
  activePools: string[]
  closed: boolean
}

const InvestmentRiskyPositionsList: FC<IProps> = ({ activePools, closed }) => {
  const { account } = useActiveWeb3React()
  const positions = useInvestorRiskyPositions(activePools, closed)

  if (!positions || !account) {
    return (
      <S.Content>
        <PulseSpinner />
      </S.Content>
    )
  }

  if (positions && positions.length === 0) {
    return (
      <S.Content>
        <S.WithoutData>
          No {closed ? "closed" : "open"} positions yet
        </S.WithoutData>
      </S.Content>
    )
  }

  return (
    <>
      <S.List>
        {positions.map((p) => (
          <RiskyPositionCardInitializer
            key={p.id}
            position={p}
            account={account}
            poolAddress={p.pool.id}
          />
        ))}
      </S.List>
    </>
  )
}

const InvestmentRiskyPositionsListWithProvider = (props) => {
  return (
    <GraphProvider value={poolsClient}>
      <InvestmentRiskyPositionsList {...props} />
    </GraphProvider>
  )
}

export default InvestmentRiskyPositionsListWithProvider
