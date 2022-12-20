import React, { useMemo } from "react"
import { useParams } from "react-router-dom"
import { formatEther } from "@ethersproject/units"

import Header from "components/Header/Layout"
import WithUserIsDaoValidatorValidation from "components/WithUserIsDaoValidatorValidation"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import GovProposalCreatingContextProvider from "context/govPool/proposals/GovProposalCreatingContext"
import ValidatorsListContextProvider from "context/govPool/proposals/ValidatorsListContext"
import {
  useGovPoolValidators,
  useGovValidatorsValidatorsToken,
} from "hooks/dao"
import { cutStringZeroes } from "utils"
import CreateGovProposalValidatorChangeValidatorSettingsForm from "forms/CreateGovProposalValidatorChangeValidatorSettingsForm"
import Skeleton from "components/Skeleton"
import { Flex } from "theme"

import * as S from "./styled"

const CreateDaoProposalValidatorChangeValidatorSettings: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()

  const [validatorsFromGraph, validatorsLoading] = useGovPoolValidators(
    daoAddress ?? ""
  )
  const [, tokenData] = useGovValidatorsValidatorsToken(daoAddress ?? "")

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

  const loader = useMemo(
    () => (
      <Flex
        gap={"24"}
        full
        m="16px 0 0 0"
        dir="column"
        ai={"center"}
        jc={"flex-start"}
      >
        <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
        <Skeleton variant={"rect"} w={"calc(100% - 32px)"} h={"80px"} />
      </Flex>
    ),
    []
  )

  return (
    <>
      <Header>Create proposal</Header>
      <WithGovPoolAddressValidation
        daoPoolAddress={daoAddress ?? ""}
        loader={loader}
      >
        <WithUserIsDaoValidatorValidation
          daoPoolAddress={daoAddress ?? ""}
          loader={loader}
        >
          {validatorsLoading && loader}
          {!validatorsLoading && (
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
          )}
        </WithUserIsDaoValidatorValidation>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default CreateDaoProposalValidatorChangeValidatorSettings
