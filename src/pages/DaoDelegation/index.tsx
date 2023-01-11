import * as React from "react"
import { Route, Routes, useParams } from "react-router-dom"

import * as S from "./styled"
import { DaoDelegationOut, DaoDelegationIn } from "./tabs"

import Header from "components/Header/Layout"
import RouteTabs from "components/RouteTabs"
import { ITab } from "interfaces"
import useGovPoolVotingAssets from "hooks/dao/useGovPoolVotingAssets"
import { useERC20 } from "hooks"

const DaoDelegation: React.FC = () => {
  const params = useParams<"daoAddress">()

  const [{ tokenAddress }] = useGovPoolVotingAssets(params.daoAddress)
  const [, token] = useERC20(tokenAddress)

  const tabs: ITab[] = [
    {
      title: "Delegated to",
      source: `/dao/${params.daoAddress}/delegation/out`,
    },
    {
      title: "Me",
      source: `/dao/${params.daoAddress}/delegation/in`,
    },
  ]

  return (
    <>
      <Header>Delegation</Header>
      <S.Container>
        <S.Indents top>
          <RouteTabs tabs={tabs} />
        </S.Indents>
        <Routes>
          <Route
            path="out"
            element={
              <DaoDelegationOut
                govPoolAddress={params.daoAddress}
                token={token}
              />
            }
          />
          <Route
            path="in"
            element={
              <DaoDelegationIn
                govPoolAddress={params.daoAddress}
                token={token}
              />
            }
          />
        </Routes>
      </S.Container>
    </>
  )
}

export default DaoDelegation
