import React, { useCallback, useContext } from "react"
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
} from "common"
import ExternalLink from "components/ExternalLink"
import { SelectField, InputField } from "fields"
import { useFormValidation, useActiveWeb3React, useBreakpoints } from "hooks"
import { useGovPoolTreasury } from "hooks/dao"
import { TokenSaleCreatingContext } from "context/govPool/proposals/TokenSaleContext"
import { stepsControllerContext } from "context/StepsControllerContext"
import { required, isBnLte } from "utils/validators"
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
  const { selectedTreasuryToken, tokenAmount } = useContext(
    TokenSaleCreatingContext
  )
  const { nextCb } = useContext(stepsControllerContext)
  const { getFieldErrorMessage, touchField, touchForm, isFieldsValid } =
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

    if (isFieldsValid) {
      nextCb()
    }
  }, [nextCb, touchForm, isFieldsValid])

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
          <CardHead title={"Токен"} />
          <CardFormControl>
            <SelectField
              placeholder="Оберіть токен з трежері"
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
              setValue={tokenAmount.set}
              label={"Кількість токенів"}
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
          <CardHead title={"Базові налаштування токен сейлу"} />
          <CardFormControl>
            <S.BaseTokenSettingsGrid>
              <InputField
                value={""}
                setValue={() => {}}
                label={"Кількість токенів"}
                nodeRight={<span>BNB</span>}
              />
              <InputField
                value={""}
                setValue={() => {}}
                label={"Кількість токенів"}
                nodeRight={<span>BNB</span>}
              />
              <InputField
                value={""}
                setValue={() => {}}
                label={"Кількість токенів"}
                nodeRight={<span>BNB</span>}
              />
              <InputField
                value={""}
                setValue={() => {}}
                label={"Кількість токенів"}
                nodeRight={<span>BNB</span>}
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
