import * as React from "react"
import { Route, Routes, useParams } from "react-router-dom"
import { useWeb3React } from "@web3-react/core"

import * as S from "./styled"
import { DaoDelegationOut, DaoDelegationIn } from "./tabs"

import Header from "components/Header/Layout"
import { Flex } from "theme"
import { useGovPoolContract } from "contracts"
import RouteTabs from "components/RouteTabs"
import { ITab } from "interfaces"

const DaoDelegation: React.FC = () => {
  const { chainId } = useWeb3React()
  const params = useParams<"daoAddress">()

  const govPoolContract = useGovPoolContract(params.daoAddress)

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
      <Header>Dao Profile</Header>
      <S.Indents top>
        <RouteTabs tabs={tabs} />
      </S.Indents>
      <S.Container>
        <Routes>
          <Route path="out" element={<DaoDelegationOut />} />
          <Route path="in" element={<DaoDelegationIn />} />
        </Routes>
      </S.Container>
    </>
  )
}

export default DaoDelegation
