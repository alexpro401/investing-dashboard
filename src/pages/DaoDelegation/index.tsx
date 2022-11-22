import * as React from "react"
import { Route, Routes, useParams } from "react-router-dom"
import { createClient, Provider as GraphProvider } from "urql"

import * as S from "./styled"
import { DaoDelegationOut, DaoDelegationIn } from "./tabs"

import Header from "components/Header/Layout"
import RouteTabs from "components/RouteTabs"
import { ITab } from "interfaces"
import useGovPoolVotingAssets from "hooks/dao/useGovPoolVotingAssets"
import { useERC20 } from "hooks/useERC20"

const govPoolsClient = createClient({
  url: process.env.REACT_APP_DAO_POOLS_API_URL || "",
  requestPolicy: "network-only",
})

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
      <S.Indents top>
        <RouteTabs tabs={tabs} />
      </S.Indents>
      <S.Container>
        <Routes>
          <Route
            path="out"
            element={<DaoDelegationOut govPoolAddress={params.daoAddress} />}
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

const DaoDelegationWithProvider = () => {
  return (
    <GraphProvider value={govPoolsClient}>
      <DaoDelegation />
    </GraphProvider>
  )
}

export default DaoDelegationWithProvider
