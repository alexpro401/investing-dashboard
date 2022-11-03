import React, { useMemo } from "react"
import { useParams } from "react-router-dom"
import { formatEther } from "@ethersproject/units"

import Header from "components/Header/Layout"
import WithUserIsDaoValidatorValidation from "components/WithUserIsDaoValidatorValidation"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import ValidatorsListContextProvider from "context/govPool/proposals/ValidatorsListContext"
import useGovPoolValidators from "hooks/useGovPoolValidators"
import useGovValidatorsValidatorsToken from "hooks/useGovValidatorsValidatorsToken"
import { cutStringZeroes } from "utils"
import CreateGovProposalValidatorChangeValidatorSettingsForm from "forms/CreateGovProposalValidatorChangeValidatorSettingsForm"

import * as S from "./styled"

const CreateDaoProposalValidatorChangeValidatorSettings: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()

  const [validatorsFromGraph] = useGovPoolValidators(daoAddress ?? "")
  const tokenData = useGovValidatorsValidatorsToken(daoAddress ?? "")

  const balances = useMemo<string[]>(
    () =>
      validatorsFromGraph.map((validator) =>
        cutStringZeroes(formatEther(validator.balance))
      ),
    [validatorsFromGraph]
  )

  const validators = useMemo<string[]>(
    () => validatorsFromGraph.map((validator) => validator.id.substring(0, 42)),
    [validatorsFromGraph]
  )

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
        <WithUserIsDaoValidatorValidation daoPoolAddress={daoAddress ?? ""}>
          <S.PageHolder>
            <S.PageContent>
              <GovProposalCreatingContextProvider>
                <ValidatorsListContextProvider
                  initialForm={{
                    balances: balances,
                    validators: validators,
                    validatorTokenSymbol: tokenData
                      ? tokenData.symbol ?? null
                      : null,
                  }}
                >
                  <CreateGovProposalValidatorChangeValidatorSettingsForm />
                </ValidatorsListContextProvider>
              </GovProposalCreatingContextProvider>
            </S.PageContent>
          </S.PageHolder>
        </WithUserIsDaoValidatorValidation>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CreateDaoProposalValidatorChangeValidatorSettings
