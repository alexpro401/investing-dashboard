import React, { useCallback, useContext, useMemo } from "react"
import { useNavigate, useLocation } from "react-router-dom"

import { stepsControllerContext } from "context/StepsControllerContext"
import { CreateFundContext } from "context/fund/CreateFundContext"
import { useFormValidation, useBreakpoints, useActiveWeb3React } from "hooks"
import { useAllTokenBalances } from "hooks/useBalance"
import { useUserTokens, useWhitelistTokens } from "hooks/useToken"
import { required, minLength, maxLength } from "utils/validators"
import {
  Card,
  CardHead,
  CardDescription,
  CardFormControl,
  TokenChip,
  Icon,
  Headline1,
  RegularText,
  CreateDaoCardStepNumber,
} from "common"
import { OverlapInputField, TextareaField } from "fields"
import Avatar from "components/Avatar"
import TokenSelect from "modals/TokenSelect"
import theme from "theme"
import { ICON_NAMES } from "consts/icon-names"
import { Token } from "lib/entities"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"

import * as S from "./styled"
import * as SForms from "common/FormSteps/styled"

const BasicFundSettings: React.FC = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { nextCb, currentStepNumber } = useContext(stepsControllerContext)
  const {
    avatarUrl,
    description,
    fundName,
    strategy,
    tickerSymbol,
    baseToken,
  } = useContext(CreateFundContext)
  const { isMobile } = useBreakpoints()

  const [balances, balancesIsLoading] = useAllTokenBalances()
  const whitelistTokens = useWhitelistTokens()
  const userTokens = useUserTokens()
  const { chainId } = useActiveWeb3React()

  const allTokens = useMemo(
    () => ({ ...whitelistTokens, ...userTokens }),
    [userTokens, whitelistTokens]
  )

  const {
    isFieldsValid,
    touchForm,
    touchField,
    isFieldValid,
    getFieldErrorMessage,
  } = useFormValidation(
    {
      fundName: fundName.get,
      tickerSymbol: tickerSymbol.get,
      description: description.get,
      strategy: strategy.get,
      baseToken: baseToken.get,
    },
    {
      fundName: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(30),
      },
      tickerSymbol: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(8),
      },
      description: {
        required,
      },
      strategy: {
        required,
      },
      baseToken: {
        required,
      },
    }
  )

  const handleTokenSelectOpen = useCallback(() => {
    navigate("modal/search")
  }, [navigate])

  const handleTokenSelectClose = useCallback(() => {
    navigate(pathname.slice(0, pathname.indexOf("/modal")))
  }, [navigate, pathname])

  const handleTokenSelect = useCallback(
    (token: Token) => {
      baseToken.set(token)
      handleTokenSelectClose()
    },
    [baseToken, handleTokenSelectClose]
  )

  const handleNextStep = useCallback(() => {
    touchForm()

    if (isFieldsValid) {
      nextCb()
    }
  }, [nextCb, touchForm, isFieldsValid])

  return (
    <SForms.StepsRoot>
      <TokenSelect
        allBalances={balances}
        balancesLoading={balancesIsLoading}
        whitelistOnly
        allTokens={allTokens}
        onClose={handleTokenSelectClose}
        onSelect={handleTokenSelect}
      />
      {!isMobile && (
        <S.DesktopHeaderWrp>
          <Headline1 color={theme.statusColors.info} desktopWeight={900}>
            Basic fund settings
          </Headline1>
          <RegularText
            color={theme.textColors.secondary}
            desktopWeight={500}
            desktopSize={"14px"}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum natus
            eveniet, quibusdam quae culpa ratione non possimus optio excepturi
            fugiat eaque quod commodi explicabo architecto nam mollitia
            accusamus ipsa deleniti!
          </RegularText>
        </S.DesktopHeaderWrp>
      )}
      {isMobile && (
        <Card>
          <CardHead
            nodeLeft={<CreateDaoCardStepNumber number={currentStepNumber} />}
            title="Basic info"
          />
          <CardDescription>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
              natus eveniet, quibusdam quae culpa ratione non possimus optio
              excepturi fugiat eaque quod commodi explicabo architecto nam
              mollitia accusamus ipsa deleniti!
            </p>
          </CardDescription>
        </Card>
      )}
      <Avatar
        m="0 auto"
        onCrop={(key, url) => avatarUrl.set(url)}
        showUploader
        size={100}
        url={avatarUrl.get}
      >
        <S.CreateFundDaoAvatarActions>
          <S.CreateFundDaoAvatarBtn>Add fund photo</S.CreateFundDaoAvatarBtn>
        </S.CreateFundDaoAvatarActions>
      </Avatar>
      <Card>
        <CardHead
          nodeLeft={<Icon name={ICON_NAMES.fileDock} />}
          title="Basic info*"
        />
        <CardDescription>
          <p>Enter fund name, ticker symbol and basic token for your fund. </p>
          <br />
          <p>{"*Once created, this info can't be changed."}</p>
        </CardDescription>
        <CardFormControl>
          <S.FundSettingsContainer>
            <S.FundSettingField
              value={fundName.get}
              setValue={fundName.set}
              label="Fund name"
              labelNodeRight={
                isFieldValid("fundName") ? (
                  <S.FieldValidIcon name={ICON_NAMES.greenCheck} />
                ) : (
                  <></>
                )
              }
              errorMessage={getFieldErrorMessage("fundName")}
              onBlur={() => touchField("fundName")}
            />
            <S.FundSettingField
              value={tickerSymbol.get}
              setValue={(v: string) => tickerSymbol.set(v.toUpperCase())}
              label="Ticker symbol"
              labelNodeRight={
                isFieldValid("tickerSymbol") ? (
                  <S.FieldValidIcon name={ICON_NAMES.greenCheck} />
                ) : (
                  <></>
                )
              }
              errorMessage={getFieldErrorMessage("tickerSymbol")}
              onBlur={() => touchField("tickerSymbol")}
            />
          </S.FundSettingsContainer>
          <OverlapInputField
            value={" "}
            readonly
            nodeLeft={
              !baseToken.get ? (
                <S.BaseTokenPlaceholder>Base token</S.BaseTokenPlaceholder>
              ) : (
                <TokenChip
                  name={baseToken.get.name ?? ""}
                  symbol={baseToken.get.symbol ?? ""}
                  link={
                    chainId
                      ? getExplorerLink(
                          chainId,
                          baseToken.get.address,
                          ExplorerDataType.ADDRESS
                        )
                      : ""
                  }
                />
              )
            }
            label={!!baseToken.get ? "Base token" : undefined}
            labelNodeRight={
              !!baseToken.get ? (
                <S.FieldValidIcon name={ICON_NAMES.greenCheck} />
              ) : (
                <></>
              )
            }
            nodeRight={
              !!baseToken.get ? (
                <S.BaseTokenIconWrp onClick={() => baseToken.set(undefined)}>
                  <Icon name={ICON_NAMES.close} />
                </S.BaseTokenIconWrp>
              ) : (
                <S.BaseTokenIconWrp>
                  <Icon name={ICON_NAMES.angleDown} />
                </S.BaseTokenIconWrp>
              )
            }
            onClick={!baseToken.get ? handleTokenSelectOpen : () => {}}
            errorMessage={getFieldErrorMessage("baseToken")}
          />
        </CardFormControl>
      </Card>
      <Card>
        <CardHead
          nodeLeft={<Icon name={ICON_NAMES.fileDock} />}
          title="Fund details"
        />
        <CardDescription>
          <p>
            Добавьте описание вашего фонда, а также опишите свою стратегию.
            Исчерпывающее и продающее описание фонда и стратегии позволит
            привлечь больше активов в управление.
          </p>
          <br />
          <p>
            Вы сможете изменить эту информацию в любой момент после создания.
          </p>
        </CardDescription>
        <CardFormControl>
          <TextareaField
            value={description.get}
            setValue={description.set}
            label="Description"
            errorMessage={getFieldErrorMessage("description")}
            onBlur={() => touchField("description")}
          />
          <TextareaField
            value={strategy.get}
            setValue={strategy.set}
            label="Fund strategy"
            errorMessage={getFieldErrorMessage("strategy")}
            onBlur={() => touchField("strategy")}
          />
        </CardFormControl>
      </Card>
      <SForms.FormStepsNavigationWrp customNextCb={handleNextStep} />
    </SForms.StepsRoot>
  )
}

export default BasicFundSettings
