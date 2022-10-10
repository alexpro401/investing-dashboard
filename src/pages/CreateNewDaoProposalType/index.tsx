import React from "react"

import Header from "components/Header/Layout"
import FundDaoCreatingContextProvider from "context/FundDaoCreatingContext"
import { DefaultProposalStep } from "forms/CreateFundDaoForm/steps"
import StepsControllerContext from "context/StepsControllerContext"

import * as S from "./styled"

const CreateNewProposalType: React.FC = () => {
  return (
    <>
      <Header>Create Proposal</Header>
      <S.CreateNewDaoProposalTypePageHolder
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <StepsControllerContext
          currentStepNumber={1}
          totalStepsAmount={5}
          prevCb={() => {
            console.log("prev")
          }}
          nextCb={() => {
            console.log("next")
          }}
        >
          <FundDaoCreatingContextProvider>
            <DefaultProposalStep />
          </FundDaoCreatingContextProvider>
        </StepsControllerContext>
      </S.CreateNewDaoProposalTypePageHolder>
    </>
  )
}

export default CreateNewProposalType
