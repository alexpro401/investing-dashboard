import { FC, useMemo } from "react"
import { v4 as uuidv4 } from "uuid"
import { isEmpty } from "lodash"
import { PulseSpinner } from "react-spinners-kit"

import { InvestorPositionsQuery } from "queries"
import { graphClientInvestors } from "utils/graphClient"
import useQueryPagination from "hooks/useQueryPagination"
import { InvestorPosition } from "interfaces/thegraphs/invest-pools"

import { Center } from "theme"
import { NoDataMessage, CardInvestorPosition } from "common"
import Tooltip from "components/Tooltip"
import LoadMore from "components/LoadMore"
import * as S from "./styled"

interface IProps {
  account?: string | null
  closed: boolean
}

const InvestmentPositionsList: FC<IProps> = ({ account, closed }) => {
  const [{ data, loading }, fetchMore] = useQueryPagination<InvestorPosition>({
    query: InvestorPositionsQuery,
    variables: useMemo(
      () => ({ address: String(account).toLowerCase(), closed }),
      [closed, account]
    ),
    pause: !account,
    context: graphClientInvestors,
    formatter: (d) => d.investorPoolPositions,
  })

  if (!account || (isEmpty(data) && loading)) {
    return (
      <Center>
        <PulseSpinner />
      </Center>
    )
  }

  if (isEmpty(data) && !loading) {
    return <NoDataMessage />
  }

  return (
    <div>
      <S.InvestorPositionsListWrp>
        <S.InvestorPositionsListHead>
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
          <CardInvestorPosition key={p.id} position={p} />
        ))}
      </S.InvestorPositionsListWrp>
      <LoadMore isLoading={loading && !!data.length} handleMore={fetchMore} />
    </div>
  )
}

export default InvestmentPositionsList
