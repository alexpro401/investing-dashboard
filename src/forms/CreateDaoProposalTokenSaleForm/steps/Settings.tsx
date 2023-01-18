import React, { useCallback, useContext, useMemo } from "react"
import { useParams } from "react-router-dom"
import { BigNumber } from "@ethersproject/bignumber"
import { formatUnits } from "@ethersproject/units"

import {
  Card,
  CardHead,
  CardFormControl,
  TokenChip,
  AppButton,
  Headline1,
  RegularText,
  CardDescription,
} from "common"
import ExternalLink from "components/ExternalLink"
import {
  SelectField,
  InputField,
  DateField,
  TextareaField,
  TokenSalePairField,
} from "fields"
import { useFormValidation, useActiveWeb3React, useBreakpoints } from "hooks"
import { useGovPoolTreasury } from "hooks/dao"
import { TokenSaleCreatingContext } from "context/govPool/proposals/TokenSaleContext"
import { stepsControllerContext } from "context/StepsControllerContext"
import {
  required,
  isBnLte,
  isBnGt,
  minLength,
  maxLength,
} from "utils/validators"
import { formatFiatNumber, formatTokenNumber, cutStringZeroes } from "utils"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import theme from "theme"

import * as S from "./styled"
import * as SForms from "common/FormSteps/styled"

const SettingsStep: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()
  const [treasury] = useGovPoolTreasury(daoAddress)
  const { chainId } = useActiveWeb3React()
  const { isMobile } = useBreakpoints()
  const {
    currentProposalIndex,
    handleUpdateTokenSaleProposal,
    tokenSaleProposals,
  } = useContext(TokenSaleCreatingContext)

  const {
    selectedTreasuryToken,
    tokenAmount,
    minAllocation,
    maxAllocation,
    sellStartDate,
    sellEndDate,
    proposalDescription,
    proposalName,
    sellPairs,
  } = useMemo(
    () => tokenSaleProposals[currentProposalIndex],
    [tokenSaleProposals, currentProposalIndex]
  )

  const { nextCb } = useContext(stepsControllerContext)
  const { getFieldErrorMessage, touchField, touchForm, isFieldsValid } =
    useFormValidation(
      {
        selectedTreasuryToken: selectedTreasuryToken,
        tokenAmount: tokenAmount,
        proposalName: proposalName,
        proposalDescription: proposalDescription,
        sellStartDate: sellStartDate.toString(),
        sellEndDate: sellEndDate.toString(),
        minAllocation: minAllocation === "" ? "0" : minAllocation,
        maxAllocation: maxAllocation === "" ? "0" : maxAllocation,
      },
      {
        selectedTreasuryToken: { required },
        proposalName: {
          required,
          minLength: minLength(4),
          maxLength: maxLength(40),
        },
        proposalDescription: {
          maxLength: maxLength(1000),
        },
        sellStartDate: {
          required,
          isBnGt: isBnGt(
            formatUnits(BigNumber.from("0"), 18),
            18,
            "Please enter valid date"
          ),
        },
        sellEndDate: {
          required,
          isBnGt: isBnGt(
            sellStartDate.toString(),
            18,
            "End date must be greater than start date"
          ),
        },
        ...(selectedTreasuryToken
          ? {
              tokenAmount: {
                required,
                ...(tokenAmount
                  ? {
                      isBnLte: isBnLte(
                        formatUnits(
                          selectedTreasuryToken.balance,
                          selectedTreasuryToken.contract_decimals
                        ).toString(),
                        selectedTreasuryToken.contract_decimals,
                        `Дао пул максимум має ${cutStringZeroes(
                          formatUnits(
                            selectedTreasuryToken.balance,
                            selectedTreasuryToken.contract_decimals
                          ).toString()
                        )} ${
                          selectedTreasuryToken.contract_ticker_symbol
                        } токенів. Оберіть валідне число`
                      ),
                      isBnGt: isBnGt(
                        formatUnits(
                          BigNumber.from("0"),
                          selectedTreasuryToken.contract_decimals
                        ),
                        selectedTreasuryToken.contract_decimals
                      ),
                    }
                  : {}),
              },
              minAllocation: {
                required,
                ...(tokenAmount
                  ? {
                      isBnGt: isBnGt(
                        formatUnits(
                          BigNumber.from("0"),
                          selectedTreasuryToken.contract_decimals
                        ),
                        selectedTreasuryToken.contract_decimals,
                        "Min allocation must be greater than 0"
                      ),
                    }
                  : {}),
              },
              maxAllocation: {
                required,
                ...(tokenAmount
                  ? {
                      isBnLte: isBnLte(
                        tokenAmount === "" ? "0" : tokenAmount,
                        selectedTreasuryToken.contract_decimals,
                        "Max allocation must be less than selected total token amount"
                      ),
                      isBnGt: isBnGt(
                        minAllocation === "" ? "0" : minAllocation,
                        selectedTreasuryToken.contract_decimals,
                        "Max allocation must be greater than min allocation"
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

    if (isFieldsValid) {
      nextCb()
    }
  }, [nextCb, touchForm, isFieldsValid])

  const handleChangeSellPair = useCallback(
    (
      index: number,
      { tokenAddress, amount }: { tokenAddress: string; amount: string }
    ) => {
      const newSellPairs = [...sellPairs]
      newSellPairs[index] = { ...newSellPairs[index], tokenAddress, amount }

      handleUpdateTokenSaleProposal(
        currentProposalIndex,
        "sellPairs",
        newSellPairs
      )
    },
    [handleUpdateTokenSaleProposal, currentProposalIndex, sellPairs]
  )

  const handleDeleteSellPair = useCallback(
    (index: number) => {
      if (sellPairs.length === 1) return

      const newSellPairs = [...sellPairs].filter((_, idx) => idx !== index)

      handleUpdateTokenSaleProposal(
        currentProposalIndex,
        "sellPairs",
        newSellPairs
      )
    },
    [handleUpdateTokenSaleProposal, currentProposalIndex, sellPairs]
  )

  const handleAddSellPair = useCallback(() => {
    handleUpdateTokenSaleProposal(
      currentProposalIndex,
      "sellPairs",
      sellPairs.concat([{ amount: "", tokenAddress: "" }])
    )
  }, [handleUpdateTokenSaleProposal, currentProposalIndex, sellPairs])

  return (
    <>
      <SForms.StepsRoot>
        {!isMobile && (
          <S.DesktopHeaderWrp>
            <Headline1 color={theme.statusColors.info} desktopWeight={900}>
              Токен сейл
            </Headline1>
            <RegularText
              color={theme.textColors.secondary}
              desktopWeight={500}
              desktopSize={"14px"}
            >
              description Lorem ipsum dolor sit amet, consectetur adipiscing
              elit, sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim
            </RegularText>
          </S.DesktopHeaderWrp>
        )}
        <Card>
          <CardHead title={"Опис пропоузалу"} />
          <CardFormControl>
            <InputField
              value={proposalName}
              setValue={(v) =>
                handleUpdateTokenSaleProposal(
                  currentProposalIndex,
                  "proposalName",
                  v
                )
              }
              label="Proposal name"
              errorMessage={getFieldErrorMessage("proposalName")}
              onBlur={() => touchField("proposalName")}
            />
            <TextareaField
              value={proposalDescription}
              setValue={(v) =>
                handleUpdateTokenSaleProposal(
                  currentProposalIndex,
                  "proposalDescription",
                  v
                )
              }
              label="Description"
              errorMessage={getFieldErrorMessage("proposalDescription")}
              onBlur={() => touchField("proposalDescription")}
            />
          </CardFormControl>
        </Card>
        <Card>
          <CardHead title={"Токен"} />
          <CardFormControl>
            <SelectField
              placeholder="Оберіть токен з трежері"
              selected={selectedTreasuryToken ?? undefined}
              setSelected={(newSelectedToken) =>
                handleUpdateTokenSaleProposal(
                  currentProposalIndex,
                  "selectedTreasuryToken",
                  newSelectedToken
                )
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
              value={tokenAmount}
              setValue={(value: string) => {
                handleUpdateTokenSaleProposal(
                  currentProposalIndex,
                  "tokenAmount",
                  value
                )
              }}
              label={"Кількість токенів"}
              type="number"
              errorMessage={getFieldErrorMessage("tokenAmount")}
              onBlur={() => touchField("tokenAmount")}
              nodeRight={
                !!selectedTreasuryToken && (
                  <AppButton
                    type="button"
                    text={"Max"}
                    color="default"
                    size="no-paddings"
                    onClick={() =>
                      selectedTreasuryToken?.balance
                        ? handleUpdateTokenSaleProposal(
                            currentProposalIndex,
                            "tokenAmount",
                            cutStringZeroes(
                              formatUnits(
                                BigNumber.from(selectedTreasuryToken.balance),
                                selectedTreasuryToken.contract_decimals
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
          <CardHead title="Продаж" />
          <CardDescription>
            <p>
              Оберіть пару або додайте декілька, до якої буде продаватись токен
            </p>
          </CardDescription>
          <CardFormControl>
            {sellPairs.map(({ amount, tokenAddress }, index) => (
              <TokenSalePairField
                key={index}
                tokenAddress={tokenAddress}
                amount={amount}
                setAmount={(v) =>
                  handleChangeSellPair(index, {
                    tokenAddress,
                    amount: v,
                  })
                }
                setTokenAddress={(newAddress) =>
                  handleChangeSellPair(index, {
                    tokenAddress: newAddress,
                    amount,
                  })
                }
                onDelete={() => handleDeleteSellPair(index)}
              />
            ))}
            <S.AddPairButton
              text={"+ Add new pair"}
              onClick={handleAddSellPair}
            />
          </CardFormControl>
        </Card>
        <Card>
          <CardHead title={"Базові налаштування токен сейлу"} />
          <CardFormControl>
            <S.BaseTokenSettingsGrid>
              <InputField
                value={minAllocation}
                setValue={(value: string) =>
                  handleUpdateTokenSaleProposal(
                    currentProposalIndex,
                    "minAllocation",
                    value
                  )
                }
                type="number"
                label={"Мін алокація"}
                nodeRight={
                  selectedTreasuryToken?.contract_ticker_symbol ? (
                    <S.BaseInputPlaceholder>
                      {selectedTreasuryToken.contract_ticker_symbol}
                    </S.BaseInputPlaceholder>
                  ) : null
                }
                errorMessage={getFieldErrorMessage("minAllocation")}
                onBlur={() => touchField("minAllocation")}
              />
              <InputField
                value={maxAllocation}
                setValue={(value: string) =>
                  handleUpdateTokenSaleProposal(
                    currentProposalIndex,
                    "maxAllocation",
                    value
                  )
                }
                type="number"
                label={"Макс алокація"}
                nodeRight={
                  selectedTreasuryToken?.contract_ticker_symbol ? (
                    <S.BaseInputPlaceholder>
                      {selectedTreasuryToken.contract_ticker_symbol}
                    </S.BaseInputPlaceholder>
                  ) : null
                }
                errorMessage={getFieldErrorMessage("maxAllocation")}
                onBlur={() => touchField("maxAllocation")}
              />
              <DateField
                date={sellStartDate}
                setDate={(value: number) => {
                  handleUpdateTokenSaleProposal(
                    currentProposalIndex,
                    "sellStartDate",
                    value
                  )
                  touchField("sellStartDate")
                }}
                placeholder={"Початок продажу"}
                minDate={new Date()}
                errorMessage={getFieldErrorMessage("sellStartDate")}
              />
              <DateField
                date={sellEndDate}
                setDate={(value: number) => {
                  handleUpdateTokenSaleProposal(
                    currentProposalIndex,
                    "sellEndDate",
                    value
                  )
                  touchField("sellEndDate")
                }}
                placeholder={"Кінець продажу"}
                minDate={new Date()}
                errorMessage={getFieldErrorMessage("sellEndDate")}
              />
            </S.BaseTokenSettingsGrid>
          </CardFormControl>
        </Card>
      </SForms.StepsRoot>
      <SForms.FormStepsNavigationWrp customNextCb={handleNextStep} />
    </>
  )
}

export { SettingsStep }
