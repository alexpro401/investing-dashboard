import { FC, useMemo } from "react"
import { v4 as uuidv4 } from "uuid"
import { PulseSpinner } from "react-spinners-kit"

import { InvestorPositionsQuery } from "queries"
import { graphClientInvestors } from "utils/graphClient"
import useQueryPagination from "hooks/useQueryPagination"
import { IInvestorProposal } from "interfaces/thegraphs/invest-pools"

import { Center } from "theme"
import { NoDataMessage } from "common"
import Tooltip from "components/Tooltip"
import LoadMore from "components/LoadMore"
import InvestPositionCard from "components/cards/position/Invest"
import * as S from "./styled"

interface IProps {
  account?: string | null
  closed: boolean
}

const InvestmentPositionsList: FC<IProps> = ({ account, closed }) => {
  const [{ data, loading }, fetchMore] = useQueryPagination<IInvestorProposal>({
    query: InvestorPositionsQuery,
    variables: useMemo(
      () => ({ address: String(account).toLowerCase(), closed }),
      [closed, account]
    ),
    pause: !account,
    context: graphClientInvestors,
    formatter: (d) => d.investorPoolPositions,
  })

  if (!account || !data || loading) {
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
      <S.InvestorPositionsListWrp>
        <S.InvestorPositionsListHead childMaxWidth={closed ? "182px" : "167px"}>
          <S.InvestorPositionsListHeadItem>
            Fund
          </S.InvestorPositionsListHeadItem>
          <S.InvestorPositionsListHeadItem>
            My Volume
          </S.InvestorPositionsListHeadItem>
          <S.InvestorPositionsListHeadItem>
            <span>Entry Price</span>
            <Tooltip id={uuidv4()}>Explain Entry Price</Tooltip>
          </S.InvestorPositionsListHeadItem>
          <S.InvestorPositionsListHeadItem>
            <span>Current price</span>
            <Tooltip id={uuidv4()}>Explain Current price</Tooltip>
          </S.InvestorPositionsListHeadItem>
          <S.InvestorPositionsListHeadItem>
            P&L in %
          </S.InvestorPositionsListHeadItem>
          <S.InvestorPositionsListHeadItem />
        </S.InvestorPositionsListHead>
        {data.map((p) => (
          <InvestPositionCard key={p.id} position={p} />
        ))}
      </S.InvestorPositionsListWrp>
      <LoadMore isLoading={loading && !!data.length} handleMore={fetchMore} />
    </>
  )
}

export default InvestmentPositionsList
