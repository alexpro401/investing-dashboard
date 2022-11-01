import React, { useMemo } from "react"
import { useParams } from "react-router-dom"
import { formatEther } from "@ethersproject/units"

import Header from "components/Header/Layout"
import WithUserIsDaoValidatorValidation from "components/WithUserIsDaoValidatorValidation"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import ValidatorsListContextProvider from "context/ValidatorsListContext"
import ValidatorsList from "components/ValidatorsList"
import useGovPoolValidators from "hooks/useGovPoolValidators"
import useGovValidatorsValidatorsToken from "hooks/useGovValidatorsValidatorsToken"
import { cutStringZeroes } from "utils"

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
              <ValidatorsListContextProvider
                initialForm={{
                  balances: balances,
                  validators: validators,
                  validatorTokenSymbol: tokenData
                    ? tokenData.symbol ?? null
                    : null,
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
