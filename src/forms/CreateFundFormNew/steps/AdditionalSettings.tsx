import React, { useCallback, useContext, useMemo, useState } from "react"

import {
  Card,
  CardHead,
  CardDescription,
  CardFormControl,
  Collapse,
  Icon,
  Headline1,
  RegularText,
  AppButton,
} from "common"
import { InputField } from "fields"
import Switch from "components/Switch"
import AddressesModal from "modals/AddressesModal"
import theme, { Flex } from "theme"
import { useBreakpoints, useFormValidation } from "hooks"
import { stepsControllerContext } from "context/StepsControllerContext"
import { CreateFundContext } from "context/fund/CreateFundContext"
import { ICON_NAMES } from "consts"
import { required } from "utils/validators"

import * as SForms from "common/FormSteps/styled"
import * as S from "./styled"

const AdditionalSettings: React.FC = () => {
  const { isMobile } = useBreakpoints()

  const [fundManagersModalOpened, setFundManagersModalOpened] =
    useState<boolean>(false)
  const [privateAddressesModalOpened, setPrivateAddrssesModalOpened] =
    useState<boolean>(false)

  const { nextCb } = useContext(stepsControllerContext)
  const {
    isLimitedEmission,
    limitedEmission,
    isMinInvestmentAmount,
    minInvestmentAmount,
    isFundManagers,
    fundManagers,
    isPrivatAddresses,
    privateAddresses,
  } = useContext(CreateFundContext)

  const fundManagersLength = useMemo(
    () => (fundManagers.get.length === 0 ? "" : "valid"),
    [fundManagers]
  )

  const privateAddressesLength = useMemo(
    () => (privateAddresses.get.length === 0 ? "" : "valid"),
    [privateAddresses]
  )

  const {
    getFieldErrorMessage,
    isFieldValid,
    isFieldsValid,
    touchField,
    touchForm,
  } = useFormValidation(
    {
      limitedEmission: limitedEmission.get,
      minInvestmentAmount: minInvestmentAmount.get,
      fundManagersLength,
      privateAddressesLength,
    },
    {
      ...(isLimitedEmission.get ? { limitedEmission: { required } } : {}),
      ...(isMinInvestmentAmount.get
        ? { minInvestmentAmount: { required } }
        : {}),
      ...(isFundManagers.get
        ? {
            fundManagersLength: { required },
          }
        : {}),
      ...(isPrivatAddresses.get
        ? {
            privateAddressesLength: { required },
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
    <SForms.StepsRoot>
      <AddressesModal
        isOpen={fundManagersModalOpened}
        toggle={() => setFundManagersModalOpened(false)}
        initialAddresses={fundManagers.get}
        onConfirm={(addresses) => fundManagers.set(addresses)}
        title={"Limit who can invest"}
        description={
          <>
            <p>
              Вы можете сделать ваш пул приватным, добавив необходимые адреса.
            </p>
            <br />
            <p>
              Добавленные адреса получает уведомления если они подключены к DeXe
              Investment. Вы можете добавить до 1000 адресов за один раз.
            </p>
          </>
        }
      />
      <AddressesModal
        isOpen={privateAddressesModalOpened}
        toggle={() => setPrivateAddrssesModalOpened(false)}
        initialAddresses={privateAddresses.get}
        onConfirm={(addresses) => privateAddresses.set(addresses)}
        title={"Limit who can invest"}
        description={
          <>
            <p>
              Вы можете сделать ваш пул приватным, добавив необходимые адреса.
            </p>
            <br />
            <p>
              Добавленные адреса получает уведомления если они подключены к DeXe
              Investment. Вы можете добавить до 1000 адресов за один раз.
            </p>
          </>
        }
      />
      {!isMobile && (
        <S.DesktopHeaderWrp>
          <Headline1 color={theme.statusColors.info} desktopWeight={900}>
            Additional settings
          </Headline1>
          <RegularText
            color={theme.textColors.secondary}
            desktopWeight={500}
            desktopSize={"14px"}
          >
            Вы сможете изменять и управлять данными установками в любой момент
            после создания фонда.
          </RegularText>
        </S.DesktopHeaderWrp>
      )}
      <Card>
        <CardHead
          nodeLeft={<Icon name={ICON_NAMES.users} />}
          nodeRight={
            <Switch
              isOn={isLimitedEmission.get}
              onChange={(n, v) => isLimitedEmission.set(v)}
              name={"create-fund-is-limited-emission-on"}
            />
          }
          title="Limited Emission"
        />
        <CardDescription>
          <p>
            Вы можете настроить эмиссию вашего фонда. Это можно менять в любой
            момент
          </p>
        </CardDescription>
        <Collapse isOpen={isLimitedEmission.get}>
          {isLimitedEmission.get && (
            <CardFormControl>
              <InputField
                value={limitedEmission.get}
                setValue={limitedEmission.set}
                label="Limited emission"
                errorMessage={getFieldErrorMessage("limitedEmission")}
                onBlur={() => touchField("limitedEmission")}
                type="number"
                placeholder="0,00"
                nodeRight={<S.EmissionNodeRight>LP</S.EmissionNodeRight>}
              />
            </CardFormControl>
          )}
        </Collapse>
      </Card>
      <Card>
        <CardHead
          nodeLeft={<Icon name={ICON_NAMES.users} />}
          nodeRight={
            <Switch
              isOn={isMinInvestmentAmount.get}
              onChange={(n, v) => isMinInvestmentAmount.set(v)}
              name={"create-fund-is-min-invest-amount-on"}
            />
          }
          title="Min Investment Amount"
        />
        <CardDescription>
          <p>
            Установите величину инвестиций ниже которой инвестира не смогут
            инвестировать в ваш фонд.
          </p>
        </CardDescription>
        <Collapse isOpen={isMinInvestmentAmount.get}>
          {isMinInvestmentAmount.get && (
            <CardFormControl>
              <InputField
                value={minInvestmentAmount.get}
                setValue={minInvestmentAmount.set}
                label="Min investment amount"
                errorMessage={getFieldErrorMessage("minInvestmentAmount")}
                onBlur={() => touchField("minInvestmentAmount")}
                type="number"
                placeholder="0,00"
                nodeRight={<S.EmissionNodeRight>LP</S.EmissionNodeRight>}
              />
            </CardFormControl>
          )}
        </Collapse>
      </Card>
      <Card>
        <CardHead
          nodeLeft={<Icon name={ICON_NAMES.users} />}
          nodeRight={
            <Switch
              isOn={isFundManagers.get}
              onChange={(n, v) => {
                isFundManagers.set(v)
                if (v) {
                  setFundManagersModalOpened(true)
                }
              }}
              name={"create-fund-is-fund-managers-on"}
            />
          }
          title="Менеджери фонда"
        />
        <CardDescription>
          <p>
            Менеджеры фонда имееют такие же права как и владелец, кроме
            открытыия риск пропозалов. Вы сможете добавлять или удалять их в
            любой момент.
          </p>
        </CardDescription>
        <Collapse isOpen={isFundManagers.get}>
          {isFundManagers.get && (
            <CardFormControl>
              <Flex jc="space-between" ai="center" gap="16" full>
                <Flex jc="center" ai="center" gap="16">
                  {isFieldValid("fundManagersLength") && <S.CheckIcon />}
                  <RegularText
                    color={
                      !isFieldValid("fundManagersLength")
                        ? theme.statusColors.error
                        : undefined
                    }
                    weight={700}
                    size={"14px"}
                    desktopSize={"16px"}
                  >
                    {fundManagers.get.length} адрес ви обрали
                  </RegularText>
                </Flex>
                <AppButton
                  text="Manage"
                  color="default"
                  type="button"
                  size="no-paddings"
                  onClick={() => setFundManagersModalOpened(true)}
                />
              </Flex>
            </CardFormControl>
          )}
        </Collapse>
      </Card>
      <Card>
        <CardHead
          nodeLeft={<Icon name={ICON_NAMES.users} />}
          nodeRight={
            <Switch
              isOn={isPrivatAddresses.get}
              onChange={(n, v) => {
                isPrivatAddresses.set(v)
                if (v) {
                  setPrivateAddrssesModalOpened(true)
                }
              }}
              name={"create-fund-is-private-addresses-on"}
            />
          }
          title="Limit who can invest/приват?"
        />
        <CardDescription>
          <p>
            Вы можете сделать ваш пул приватным, добавив необходимые адреса.
          </p>
        </CardDescription>
        <Collapse isOpen={isPrivatAddresses.get}>
          {isPrivatAddresses.get && (
            <CardFormControl>
              <Flex jc="space-between" ai="center" gap="16" full>
                <Flex jc="center" ai="center" gap="16">
                  {isFieldValid("privateAddressesLength") && <S.CheckIcon />}
                  <RegularText
                    color={
                      !isFieldValid("privateAddressesLength")
                        ? theme.statusColors.error
                        : undefined
                    }
                    weight={700}
                    size={"14px"}
                    desktopSize={"16px"}
                  >
                    {privateAddresses.get.length} адрес ви обрали
                  </RegularText>
                </Flex>
                <AppButton
                  text="Manage"
                  color="default"
                  type="button"
                  size="no-paddings"
                  onClick={() => setPrivateAddrssesModalOpened(true)}
                />
              </Flex>
            </CardFormControl>
          )}
        </Collapse>
      </Card>
      <SForms.FormStepsNavigationWrp customNextCb={handleNextStep} />
    </SForms.StepsRoot>
  )
}

export default AdditionalSettings
