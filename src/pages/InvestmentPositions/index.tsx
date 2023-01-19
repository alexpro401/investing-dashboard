import { Routes, Route } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"

import * as S from "./styled"
import { ITab } from "interfaces"
import Tooltip from "components/Tooltip"
import InvestmentPositionsList from "./List"
import { useActiveWeb3React, useBreakpoints } from "hooks"

const InvestmentPositions = () => {
  const { account } = useActiveWeb3React()
  const { isMobile } = useBreakpoints()

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
      <S.ListTopWrp>
        <S.PageSubTabs tabs={tabs} />
        {!isMobile && (
          <S.ListTopInfo>
            <span>Whitelist positions</span>
            <Tooltip id={uuidv4()}>Info???</Tooltip>
          </S.ListTopInfo>
        )}
      </S.ListTopWrp>
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
