import { FC, useMemo } from "react"
import { PulseSpinner } from "react-spinners-kit"
import { isNil } from "lodash"

import { useActiveWeb3React } from "hooks"
import { usePoolContract } from "hooks/usePool"
import useRiskyPosition from "hooks/useRiskyPosition"
import useQueryPagination from "hooks/useQueryPagination"
import { InvestorProposalsPositionsQuery } from "queries"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { InvestorRiskyPositionWithVests } from "interfaces/thegraphs/investors"

import LoadMore from "components/LoadMore"
import RiskyInvestorPositionCard from "components/cards/position/RiskyInvestor"

import { graphClientInvestors } from "utils/graphClient"
import { NoDataMessage } from "common"
import { Center } from "theme"
import * as S from "./styled"
import Tooltip from "components/Tooltip"
import { v4 as uuidv4 } from "uuid"

interface IRiskyCardInitializer {
  position: InvestorRiskyPositionWithVests
}

const RiskyPositionCardInitializer: FC<IRiskyCardInitializer> = ({
  position,
}) => {
  const data = useRiskyPosition({
    proposalAddress: position.proposalContract.id,
    // Must subtract 2
    // because in useRiskyPosition add 1 (positionId have shift of one between contract and graph)
    // but here we use id from graph
    proposalId: String(Number(position.proposalId) - 1),
    closed: position.isClosed,
  })

  const poolAddress = useMemo(() => {
    if (isNil(data)) return ""
    return data.proposal.basicPool.id
  }, [data])

  const [, poolInfo] = usePoolContract(poolAddress)

  const [{ poolMetadata }] = usePoolMetadata(
    poolAddress,
    poolInfo?.parameters.descriptionURL
  )

  const positionDTO = useMemo(() => {
    if (isNil(position) || isNil(data)) {
      return undefined
    }

    return {
      ...position,
      token: data.proposal.token,
      pool: {
        id: data.proposal.basicPool.id,
        baseToken: data.proposal.basicPool.baseToken,
      },
    }
  }, [position, data])

  if (!position || !poolInfo || !poolMetadata || !positionDTO) {
    return null
  }

  return (
    <RiskyInvestorPositionCard
      position={positionDTO}
      poolInfo={poolInfo}
      poolMetadata={poolMetadata}
      proposalId={position.proposalId}
    />
  )
}

interface IProps {
  activePools?: string[]
  closed: boolean
}

const InvestmentRiskyPositionsList: FC<IProps> = ({ activePools, closed }) => {
  const { account } = useActiveWeb3React()

  const [{ data, loading }, fetchMore] =
    useQueryPagination<InvestorRiskyPositionWithVests>({
      query: InvestorProposalsPositionsQuery,
      variables: useMemo(
        () => ({
          address: String(account).toLocaleLowerCase(),
          type: "RISKY_PROPOSAL",
          closed,
        }),
        [closed, account]
      ),
      pause: isNil(closed) || isNil(account),
      context: graphClientInvestors,
      formatter: (d) => d.proposalPositions,
    })

  if (!activePools || !data || !account || (data.length === 0 && loading)) {
    return (
      <Center>
        <PulseSpinner />
      </Center>
    )
  }

  if (data && data.length === 0 && !loading) {
    return <NoDataMessage />
  }

  return (
    <>
      <S.InvestorRiskyPositionsListWrp>
        <S.InvestorRiskyPositionsListHead>
          <S.InvestorRiskyPositionsListHeadItem>
            Fund
          </S.InvestorRiskyPositionsListHeadItem>

          <S.InvestorRiskyPositionsListHeadItem>
            My Volume
          </S.InvestorRiskyPositionsListHeadItem>

          <S.InvestorRiskyPositionsListHeadItem>
            <span>Entry Price</span>
            <Tooltip id={uuidv4()}>Explain Entry Price</Tooltip>
          </S.InvestorRiskyPositionsListHeadItem>

          <S.InvestorRiskyPositionsListHeadItem>
            <span>Current price</span>
            <Tooltip id={uuidv4()}>Explain Current price</Tooltip>
          </S.InvestorRiskyPositionsListHeadItem>

          <S.InvestorRiskyPositionsListHeadItem>
            P&L in %
          </S.InvestorRiskyPositionsListHeadItem>
        </S.InvestorRiskyPositionsListHead>
        {data.map((p) => (
          <RiskyPositionCardInitializer key={p.id} position={p} />
        ))}
      </S.InvestorRiskyPositionsListWrp>
      <LoadMore isLoading={loading && !!data.length} handleMore={fetchMore} />
    </>
  )
}

export default InvestmentRiskyPositionsList
