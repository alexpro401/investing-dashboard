import * as React from "react"
import { Route, Routes, useParams } from "react-router-dom"

import * as S from "./styled"

import Header from "components/Header/Layout"

import RouteTabs from "components/RouteTabs"
import { ITab } from "interfaces"
import ClaimList from "./ClaimList"

const DaoPoolClaim: React.FC = () => {
  const { daoAddress } = useParams()

  const tabs = React.useMemo<ITab[]>(
    () => [
      {
        title: "Distribution",
        source: `/dao/${daoAddress}/claim/distribution`,
      },
      {
        title: "Rewards",
        source: `/dao/${daoAddress}/claim/rewards`,
      },
    ],
    [daoAddress]
  )

  return (
    <>
      <Header>Claim</Header>
      <S.Container>
        <S.Indents top>
          <RouteTabs tabs={tabs} />
        </S.Indents>
        <Routes>
          <Route
            path="distribution"
            element={
              <ClaimList
                daoAddress={daoAddress}
                status={"completed-distribution"}
              />
            }
          />
          <Route
            path="rewards"
            element={
              <ClaimList daoAddress={daoAddress} status={"completed-rewards"} />
            }
          />
        </Routes>
      </S.Container>
    </>
  )
}

export default DaoPoolClaim
