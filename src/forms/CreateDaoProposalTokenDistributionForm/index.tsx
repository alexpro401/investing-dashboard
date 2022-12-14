import React, { useContext, useCallback } from "react"
import { useParams } from "react-router-dom"
import { BigNumber } from "@ethersproject/bignumber"
import { formatUnits } from "@ethersproject/units"
import { useActiveWeb3React } from "hooks"

import {
  useGovPoolTreasury,
  useGovPoolCreateDistributionProposal,
} from "hooks/dao"
import { CreatingProposalSuccessModal } from "common/GovProposal"
import {
  Card,
  CardDescription,
  CardHead,
  CardFormControl,
  CreateDaoCardStepNumber,
  TokenChip,
  AppButton,
} from "common"
import ExternalLink from "components/ExternalLink"
import { InputField, TextareaField, SelectField } from "fields"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import { TokenDistributionCreatingContext } from "context/govPool/proposals/TokenDistributionContext"
import { useFormValidation } from "hooks/useFormValidation"
import { required, minLength, maxLength, isBnLte } from "utils/validators"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { formatFiatNumber, formatTokenNumber } from "utils"
import { cutStringZeroes } from "utils"

import * as S from "./styled"

const CreateDaoProposalTokenDistributionForm: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()
  const [treasury] = useGovPoolTreasury(daoAddress)
  const { chainId } = useActiveWeb3React()
  const { proposalName, proposalDescription } = useContext(
    GovProposalCreatingContext
  )
  const { selectedTreasuryToken, tokenAmount } = useContext(
    TokenDistributionCreatingContext
  )
  const createProposal = useGovPoolCreateDistributionProposal(daoAddress ?? "")

  const { getFieldErrorMessage, touchField, isFieldsValid, touchForm } =
    useFormValidation(
      {
        proposalName: proposalName.get,
        description: proposalDescription.get,
        selectedTreasuryToken: selectedTreasuryToken.get,
        tokenAmount: tokenAmount.get,
      },
      {
        proposalName: {
          required,
          minLength: minLength(4),
          maxLength: maxLength(40),
        },
        proposalDescription: {
          maxLength: maxLength(1000),
        },
        selectedTreasuryToken: { required },
        ...(selectedTreasuryToken.get && tokenAmount.get
          ? {
              tokenAmount: {
                required,
                isBnLte: isBnLte(
                  formatUnits(
                    selectedTreasuryToken.get.balance,
                    selectedTreasuryToken.get.contract_decimals
                  ).toString(),
                  selectedTreasuryToken.get.contract_decimals,
                  `Дао пул максимум має ${cutStringZeroes(
                    formatUnits(
                      selectedTreasuryToken.get.balance,
                      selectedTreasuryToken.get.contract_decimals
                    ).toString()
                  )} ${
                    selectedTreasuryToken.get.contract_ticker_symbol
                  } токенів. Оберіть валідне число`
                ),
              },
            }
          : {}),
      }
    )

  const handleCreateProposal = useCallback(() => {
    touchForm()

    if (!selectedTreasuryToken.get) return

    if (isFieldsValid) {
      createProposal({
        proposalName: proposalName.get,
        proposalDescription: proposalDescription.get,
        tokenAddress: selectedTreasuryToken.get.contract_address,
        tokenDecimals: selectedTreasuryToken.get.contract_decimals,
        tokenAmount: tokenAmount.get,
      })
    }
  }, [
    touchForm,
    isFieldsValid,
    createProposal,
    proposalName,
    proposalDescription,
    selectedTreasuryToken,
    tokenAmount,
  ])

  return (
    <S.StepsContainer>
      <S.StepsRoot>
        <CreatingProposalSuccessModal />
        <Card>
          <CardHead
            nodeLeft={<CreateDaoCardStepNumber number={1} />}
            title="Select token from treasury"
          />
          <CardDescription>
            <p>
              Choose the ERC-20 token for distibution — make sure to have enough
              of this token in the DAO treasury.
            </p>
          </CardDescription>
          <CardFormControl>
            <SelectField
              placeholder="ERC-20"
              selected={selectedTreasuryToken.get ?? undefined}
              setSelected={(newSelectedToken) =>
                selectedTreasuryToken.set(newSelectedToken)
              }
              list={treasury?.items ?? []}
              searchingFields={[
                "contract_address",
                "contract_ticker_symbol",
                "contract_name",
              ]}
              errorMessage={getFieldErrorMessage("selectedTreasuryToken")}
              onBlur={() => touchField("selectedTreasuryToken")}
              renderSelected={(token) =>
                token ? (
                  <TokenChip
                    name={token.contract_name}
                    symbol={token.contract_ticker_symbol}
                    link={
                      chainId
                        ? getExplorerLink(
                            chainId,
                            token.contract_address,
                            ExplorerDataType.ADDRESS
                          )
                        : ""
                    }
                  />
                ) : null
              }
              renderItem={(token) => (
                <S.TokenContainer>
                  <S.TokenContainerLeft>
                    <S.TokenImg src={token.logo_url} />
                    <S.TokenNamings>
                      <S.TokenTitle>
                        <S.TokenTitleInner>
                          {token.contract_ticker_symbol}
                        </S.TokenTitleInner>
                        <ExternalLink
                          href={
                            chainId
                              ? getExplorerLink(
                                  chainId,
                                  token.contract_address,
                                  ExplorerDataType.ADDRESS
                                )
                              : ""
                          }
                        />
                      </S.TokenTitle>
                      <S.TokenName>{token.contract_name}</S.TokenName>
                    </S.TokenNamings>
                  </S.TokenContainerLeft>
                  <S.TokenContainerRight>
                    <S.TokenUsdAmount>
                      {"$" + formatFiatNumber(token.quote)}
                    </S.TokenUsdAmount>
                    <S.TokenName>
                      {formatTokenNumber(
                        BigNumber.from(token.balance),
                        token.contract_decimals,
                        6
                      )}
                    </S.TokenName>
                  </S.TokenContainerRight>
                </S.TokenContainer>
              )}
            />
            <InputField
              value={tokenAmount.get}
              type={"number"}
              setValue={tokenAmount.set}
              label="Amount of token"
              errorMessage={getFieldErrorMessage("tokenAmount")}
              onBlur={() => touchField("tokenAmount")}
              nodeRight={
                !!selectedTreasuryToken.get && (
                  <AppButton
                    type="button"
                    text={"Max"}
                    color="default"
                    size="no-paddings"
                    onClick={() =>
                      selectedTreasuryToken.get?.balance
                        ? tokenAmount.set(
                            cutStringZeroes(
                              formatUnits(
                                BigNumber.from(
                                  selectedTreasuryToken.get.balance
                                ),
                                selectedTreasuryToken.get.contract_decimals
                              )
                            )
                          )
                        : null
                    }
                  />
                )
              }
            />
          </CardFormControl>
        </Card>
        <Card>
          <CardHead
            nodeLeft={<CreateDaoCardStepNumber number={2} />}
            title="Basic info"
          />
          <CardDescription>
            <p>
              Describe your proposal and give it a clear name so voters can
              immediately grasp what it’s about.
            </p>
            <p>
              A thorough and concise description helps DAO members make the
              right decision when voting on it.
            </p>
          </CardDescription>
          <CardFormControl>
            <InputField
              value={proposalName.get}
              setValue={proposalName.set}
              label="Proposal name"
              errorMessage={getFieldErrorMessage("proposalName")}
              onBlur={() => touchField("proposalName")}
            />
            <TextareaField
              value={proposalDescription.get}
              setValue={proposalDescription.set}
              label="Description"
              errorMessage={getFieldErrorMessage("proposalDescription")}
              onBlur={() => touchField("proposalDescription")}
            />
          </CardFormControl>
        </Card>
        <S.SubmitButton
          type="button"
          size="large"
          onClick={handleCreateProposal}
          text={"Create proposal"}
        />
      </S.StepsRoot>
    </S.StepsContainer>
  )
}

export default CreateDaoProposalTokenDistributionForm
