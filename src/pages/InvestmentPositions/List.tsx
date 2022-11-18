import { FC, useMemo, useEffect, useRef } from "react"
import { PulseSpinner } from "react-spinners-kit"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

import { InvestorPositionsQuery } from "queries"
import useQueryPagination from "hooks/useQueryPagination"
import { IInvestorProposal } from "interfaces/thegraphs/invest-pools"

import LoadMore from "components/LoadMore"
import InvestPositionCard from "components/cards/position/Invest"
import S from "./styled"
import { createClient } from "urql"

const investorsClient = createClient({
  url: process.env.REACT_APP_INVESTORS_API_URL || "",
  requestPolicy: "network-only",
})

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
    context: investorsClient,
    formatter: (d) => d.investorPoolPositions,
  })

  const loader = useRef<any>()

  // manually disable scrolling *refresh this effect when ref container dissapeared from DOM
  useEffect(() => {
    if (!loader.current) return
    disableBodyScroll(loader.current)

    return () => clearAllBodyScrollLocks()
  }, [loader, loading])

  if (!account || !data || (data.length === 0 && loading)) {
    return (
      <S.Content>
        <PulseSpinner />
      </S.Content>
    )
  }

  if (data && data.length === 0 && !loading) {
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
      <S.List ref={loader}>
        {data.map((p) => (
          <InvestPositionCard key={p.id} position={p} />
        ))}
        <LoadMore
          isLoading={loading && !!data.length}
          handleMore={fetchMore}
          r={loader}
        />
      </S.List>
    </>
  )
}

export default InvestmentPositionsList
