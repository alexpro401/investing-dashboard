import { Routes, Route } from "react-router-dom"

import RouteTabs from "components/RouteTabs"
import InvestmentPositionsList from "./List"

import { ITab } from "interfaces"
import { useActiveWeb3React } from "hooks"

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
      <RouteTabs m="16px 16px 0" tabs={tabs} />
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
