import React from "react"
import { useParams } from "react-router-dom"

import Header from "components/Header/Layout"
import WithUserIsDaoValidatorValidation from "components/WithUserIsDaoValidatorValidation"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import ValidatorsListContextProvider from "context/ValidatorsListContext"
import ValidatorsList from "components/ValidatorsList"

import * as S from "./styled"

const CreateDaoProposalValidatorChangeValidatorSettings: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
        <WithUserIsDaoValidatorValidation daoPoolAddress={daoAddress ?? ""}>
          <S.PageHolder>
            <S.PageContent>
              <ValidatorsListContextProvider
                initialForm={{
                  balances: ["0"],
                  validators: ["0x173D87d5621c566C494061Cbfc4309FBED1b31D4"],
                  validatorTokenSymbol: null,
                }}
              >
                <ValidatorsList />
              </ValidatorsListContextProvider>
            </S.PageContent>
          </S.PageHolder>
        </WithUserIsDaoValidatorValidation>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CreateDaoProposalValidatorChangeValidatorSettings
