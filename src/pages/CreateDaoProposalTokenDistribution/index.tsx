import React from "react"
import { useParams } from "react-router-dom"

import Header from "components/Header/Layout"
import { useGovPoolTreasury } from "hooks/dao"

import * as S from "./styled"

const CreateDaoProposalTokenDistribution: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()
  const [treasury] = useGovPoolTreasury(daoAddress)

  console.log("treasury: ", treasury)

  return (
    <>
      <Header>Create proposal</Header>something
    </>
  )
}

export default CreateDaoProposalTokenDistribution
