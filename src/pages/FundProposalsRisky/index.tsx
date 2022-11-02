import { FC } from "react"
import { Routes, Route, useParams } from "react-router-dom"

import { ITab } from "interfaces"

import RouteTabs from "components/RouteTabs"
import Proposals from "./Proposals"
import Positions from "./Positions"

import S from "./styled"

const FundProposalsRisky: FC = () => {
  const { poolAddress } = useParams()

  const tabs: ITab[] = [
    {
      title: "Risk proposals",
      source: `/fund-positions/${poolAddress}/proposals/open`,
    },
    {
      title: "Positions",
      source: `/fund-positions/${poolAddress}/proposals/positions`,
    },
    {
      title: "Closed",
      source: `/fund-positions/${poolAddress}/proposals/closed`,
    },
  ]

  return (
    <>
      <RouteTabs m="16px 16px 0" tabs={tabs} />
      <S.Container>
        <Routes>
          <Route
            path="open"
            element={<Proposals poolAddress={poolAddress} />}
          />
          <Route
            path="positions"
            element={<Positions closed={false} poolAddress={poolAddress} />}
          />
          <Route
            path="closed"
            element={<Positions closed={true} poolAddress={poolAddress} />}
          />
        </Routes>
      </S.Container>
    </>
  )
}

export default FundProposalsRisky
