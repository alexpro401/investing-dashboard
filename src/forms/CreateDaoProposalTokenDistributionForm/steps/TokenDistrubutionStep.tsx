import React, { useContext, useCallback } from "react"
import { useParams } from "react-router-dom"
import { createPortal } from "react-dom"
import { BigNumber } from "@ethersproject/bignumber"
import { formatUnits } from "@ethersproject/units"
import { useActiveWeb3React, useBreakpoints } from "hooks"

import { useGovPoolTreasury } from "hooks/dao"
import {
  Card,
  CardDescription,
  CardHead,
  CardFormControl,
  CreateDaoCardStepNumber,
  TokenChip,
  AppButton,
  StepsNavigation,
} from "common"
import ExternalLink from "components/ExternalLink"
import { InputField, SelectField } from "fields"
import { stepsControllerContext } from "context/StepsControllerContext"
import { TokenDistributionCreatingContext } from "context/govPool/proposals/TokenDistributionContext"
import { useFormValidation } from "hooks/useFormValidation"
import { required, isBnLte } from "utils/validators"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { formatFiatNumber, formatTokenNumber } from "utils"
import { cutStringZeroes } from "utils"

import * as S from "../styled"

const TokenDistributionStep: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()
  const [treasury] = useGovPoolTreasury(daoAddress)

  const { chainId } = useActiveWeb3React()
  const { selectedTreasuryToken, tokenAmount } = useContext(
    TokenDistributionCreatingContext
  )
  const { currentStepNumber, nextCb } = useContext(stepsControllerContext)

  const { getFieldErrorMessage, touchField, isFieldsValid, touchForm } =
    useFormValidation(
      {
        selectedTreasuryToken: selectedTreasuryToken.get,
        tokenAmount: tokenAmount.get,
      },
      {
        selectedTreasuryToken: { required },
        ...(selectedTreasuryToken.get
          ? {
              tokenAmount: {
                required,
                ...(tokenAmount.get
                  ? {
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
                    }
                  : {}),
              },
            }
          : {}),
      }
    )

  const handleNextStep = useCallback(() => {
    touchForm()

    if (!selectedTreasuryToken.get) return

    if (isFieldsValid) {
      nextCb()
    }
  }, [nextCb, touchForm, isFieldsValid, selectedTreasuryToken])

  const appNavigationEl = document.querySelector("#app-navigation")

  const { isMobile } = useBreakpoints()

  return (
    <>
      <S.StepsRoot>
        <Card>
          <CardHead
            nodeLeft={<CreateDaoCardStepNumber number={currentStepNumber} />}
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
      </S.StepsRoot>
      {appNavigationEl ? (
        createPortal(
          <StepsNavigation customNextCb={handleNextStep} />,
          appNavigationEl
        )
      ) : !isMobile ? (
        <StepsNavigation customNextCb={handleNextStep} />
      ) : (
        <></>
      )}
    </>
  )
}

export default TokenDistributionStep