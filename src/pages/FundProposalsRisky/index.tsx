import { FC } from "react"
import { v4 as uuidv4 } from "uuid"
import { Routes, Route, useParams } from "react-router-dom"

import { ITab } from "interfaces"

import Proposals from "./Proposals"
import Positions from "./Positions"

import * as S from "./styled"
import { useBreakpoints } from "hooks"
import Tooltip from "components/Tooltip"

const FundProposalsRisky: FC = () => {
  const { poolAddress } = useParams()
  const { isMobile } = useBreakpoints()

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
      <S.ListTopWrp>
        <S.PageSubTabs tabs={tabs} />
        {!isMobile && (
          <S.ListTopInfo>
            <span>Risk proposal</span>
            <Tooltip id={uuidv4()}>Info???</Tooltip>
          </S.ListTopInfo>
        )}
      </S.ListTopWrp>

      <Routes>
        <Route path="open" element={<Proposals poolAddress={poolAddress} />} />
        <Route
          path="positions"
          element={<Positions closed={false} poolAddress={poolAddress} />}
        />
        <Route
          path="closed"
          element={<Positions closed={true} poolAddress={poolAddress} />}
        />
      </Routes>
    </>
  )
}

export default FundProposalsRisky
