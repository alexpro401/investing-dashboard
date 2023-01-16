import { FC, useMemo } from "react"
import { PulseSpinner } from "react-spinners-kit"

import { InvestorPositionsQuery } from "queries"
import useQueryPagination from "hooks/useQueryPagination"
import { IInvestorProposal } from "interfaces/thegraphs/invest-pools"

import LoadMore from "components/LoadMore"
import InvestPositionCard from "components/cards/position/Invest"
import { graphClientInvestors } from "utils/graphClient"
import { NoDataMessage } from "../../common"
import { Center } from "../../theme"

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

  if (!account || !data || (data.length === 0 && loading)) {
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
      {data.map((p) => (
        <InvestPositionCard key={p.id} position={p} />
      ))}
      <LoadMore isLoading={loading && !!data.length} handleMore={fetchMore} />
    </>
  )
}

export default InvestmentPositionsList
