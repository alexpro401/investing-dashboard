import { Routes, Route } from "react-router-dom"

import InvestmentPositionsList from "./List"

import { ITab } from "interfaces"
import { useActiveWeb3React } from "hooks"
import * as S from "./styled"

const InvestmentPositions = () => {
  const { account } = useActiveWeb3React()

  const tabs: ITab[] = [
    {
      title: "Open",
      source: `/investment/positions/open`,
    },
    {
      title: "Closed",
      source: `/investment/positions/closed`,
    },
  ]

  return (
    <>
      <S.PageSubTabs tabs={tabs} />
      <Routes>
        <Route
          path="open"
          element={<InvestmentPositionsList account={account} closed={false} />}
        ></Route>
        <Route
          path="closed"
          element={<InvestmentPositionsList account={account} closed={true} />}
        ></Route>
      </Routes>
    </>
  )
}

export default InvestmentPositions
