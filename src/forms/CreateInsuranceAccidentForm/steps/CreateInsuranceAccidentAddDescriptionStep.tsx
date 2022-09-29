import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { isNil } from "lodash"
import { useWeb3React } from "@web3-react/core"

import CreateInsuranceAccidentCardHead from "forms/CreateInsuranceAccidentForm/components/CreateInsuranceAccidentCardHead"
import CreateInsuranceAccidentCardStepNumber from "forms/CreateInsuranceAccidentForm/components/CreateInsuranceAccidentCardStepNumber"

import * as S from "../styled/step-add-description"

import {
  StepsRoot,
  StepsBottomNavigation,
  CreateInsuranceAccidentCard as CIACard,
} from "forms/CreateInsuranceAccidentForm/styled"
import { InsuranceAccidentCreatingContext } from "context/InsuranceAccidentCreatingContext"
import { Flex, Text } from "theme"
import { normalizeBigNumber } from "utils"
import { divideBignumbers, multiplyBignumbers } from "utils/formulas"
import { BigNumber } from "@ethersproject/bignumber"
import { ZERO } from "constants/index"
import { ICON_NAMES } from "constants/icon-names"
import { AppButton, Icon } from "common"
import { useInsuranceContract } from "hooks/useContract"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { selectDexeAddress } from "state/contracts/selectors"
import { useSelector } from "react-redux"
import { InputField, TextareaField } from "fields"
import { useFormValidation } from "hooks/useFormValidation"
import { required } from "utils/validators"
import { readFromClipboard } from "utils/clipboard"

const CreateInsuranceAccidentAddDescriptionStep: FC = () => {
  const { account } = useWeb3React()
  const { form, investorsTotals, investorsInfo } = useContext(
    InsuranceAccidentCreatingContext
  )
  const { chat, description } = form

  // Payload
  const insurance = useInsuranceContract()
  const dexeAddress = useSelector(selectDexeAddress)
  const [insuranceTreasuryDEXE, setInsuranceTreasuryDEXE] = useState(ZERO)
  const dexePrice = useTokenPriceOutUSD({
    tokenAddress: dexeAddress,
  })
  const insuranceTreasuryUSD = useTokenPriceOutUSD({
    tokenAddress: dexeAddress,
    amount: insuranceTreasuryDEXE,
  })

  useEffect(() => {
    if (!insurance) {
      return
    }
    ;(async () => {
      try {
        const maxTreasuryPayout = await insurance.getMaxTreasuryPayout()

        if (!isNil(maxTreasuryPayout)) {
          setInsuranceTreasuryDEXE(maxTreasuryPayout)
        }
      } catch (e) {
        // TODO: handle error
        console.error(e)
      }
    })()
  }, [insurance])

  const _inDayLpAmount = useMemo(() => {
    if (
      isNil(account) ||
      isNil(investorsInfo) ||
      isNil(investorsInfo.get) ||
      isNil(investorsInfo.get.lpHistory)
    ) {
      return ZERO
    }

    return BigNumber.from(
      investorsInfo.get.lpHistory[String(account).toLocaleLowerCase()].lpHistory
        .currentLpAmount
    )
  }, [account, investorsInfo])

  const _currentLPAmount = useMemo(() => {
    if (
      isNil(account) ||
      isNil(investorsInfo) ||
      isNil(investorsInfo.get) ||
      isNil(investorsInfo.get.lpCurrent)
    )
      return ZERO

    return divideBignumbers(
      [
        BigNumber.from(
          investorsInfo.get.lpCurrent[String(account).toLocaleLowerCase()]
            .totalLPInvestVolume
        ),
        18,
      ],
      [
        BigNumber.from(
          investorsInfo.get.lpCurrent[String(account).toLocaleLowerCase()]
            .totalLPDivestVolume
        ),
        18,
      ]
    )
  }, [account, investorsInfo])

  const userLossUSD = useMemo(() => {
    if (!_currentLPAmount || !_inDayLpAmount) {
      return { big: ZERO, format: "0.0" }
    }
    const big = divideBignumbers([_inDayLpAmount, 18], [_currentLPAmount, 18])
    return { big, format: normalizeBigNumber(big, 18, 3) }
  }, [_currentLPAmount, _inDayLpAmount])

  const userLossDEXE = useMemo(() => {
    if (isNil(dexePrice) || userLossUSD.big.isZero()) {
      return "0.0"
    }

    const value = divideBignumbers(
      [BigNumber.from(userLossUSD.big), 18],
      [BigNumber.from(dexePrice), 18]
    )
    return normalizeBigNumber(value, 18, 3)
  }, [dexePrice, userLossUSD])

  const userCoverageDEXE = useMemo(() => {
    if (
      isNil(investorsInfo) ||
      isNil(investorsInfo.get) ||
      isNil(investorsInfo.get.insuranceHistory)
    ) {
      return { big: ZERO, format: "0.0" }
    }
    const stake = investorsInfo.get.insuranceHistory[0].stake

    const big = BigNumber.from(stake).mul(10)
    return { big, format: normalizeBigNumber(big, 18, 3) }
  }, [investorsInfo])

  const userCoverageUSD = useMemo(() => {
    if (isNil(userCoverageDEXE) || isNil(dexePrice)) {
      return { format: "0.0" }
    }
    const value = multiplyBignumbers(
      [BigNumber.from(userCoverageDEXE.big), 18],
      [BigNumber.from(dexePrice), 18]
    )

    return normalizeBigNumber(value, 18, 3)
  }, [dexePrice, userCoverageDEXE])

  const totalLossDEXE = useMemo(() => {
    if (
      isNil(dexePrice) ||
      isNil(investorsTotals) ||
      isNil(investorsTotals.get) ||
      BigNumber.from(investorsTotals.get.loss).isZero()
    ) {
      return "0.0"
    }

    const value = divideBignumbers(
      [BigNumber.from(investorsTotals.get.loss), 18],
      [BigNumber.from(dexePrice), 18]
    )

    return normalizeBigNumber(value, 18, 3)
  }, [dexePrice, investorsTotals])

  const totalLossUSD = useMemo(() => {
    if (
      isNil(investorsTotals) ||
      isNil(investorsTotals.get) ||
      BigNumber.from(investorsTotals.get.loss).isZero()
    ) {
      return "0.0"
    }

    return normalizeBigNumber(BigNumber.from(investorsTotals.get.loss), 18, 3)
  }, [investorsTotals])

  const totalCoverageDEXE = useMemo(() => {
    if (
      isNil(investorsTotals) ||
      isNil(investorsTotals.get) ||
      BigNumber.from(investorsTotals.get.coverage).isZero()
    ) {
      return "0.0"
    }

    return normalizeBigNumber(
      BigNumber.from(investorsTotals.get.coverage),
      18,
      3
    )
  }, [investorsTotals])

  const totalCoverageUSD = useMemo(() => {
    if (
      isNil(dexePrice) ||
      isNil(investorsTotals) ||
      isNil(investorsTotals.get) ||
      BigNumber.from(investorsTotals.get.coverage).isZero()
    ) {
      return "0.0"
    }

    const value = multiplyBignumbers(
      [BigNumber.from(investorsTotals.get.coverage), 18],
      [BigNumber.from(dexePrice), 18]
    )

    return normalizeBigNumber(BigNumber.from(value), 18, 3)
  }, [investorsTotals, dexePrice])

  // Form
  const { getFieldErrorMessage, touchField } = useFormValidation(
    {
      chat: chat.get,
      description: description.get,
    },
    {
      chat: { required },
      description: { required },
    }
  )

  const pasteFromClipboard = useCallback(
    async (dispatchCb: Dispatch<SetStateAction<any>>) => {
      dispatchCb(await readFromClipboard())
    },
    []
  )

  return (
    <>
      <StepsRoot gap={"24"} dir={"column"} ai={"stretch"} p={"16px"} full>
        <CIACard.Container>
          <CreateInsuranceAccidentCardHead
            icon={<CreateInsuranceAccidentCardStepNumber number={4} />}
            title="Финальный шаг text"
          />
          <CIACard.Description>
            <p>текст</p>
          </CIACard.Description>
        </CIACard.Container>

        <Flex full>
          <CIACard.Container p="16px 16px 4px">
            <CreateInsuranceAccidentCardHead
              icon={<Icon name={ICON_NAMES.fileDock} />}
              title="Дані"
            />
            <div>
              <S.DataBlock>
                <Flex m="0 0 16px" full jc="space-between">
                  <Text fz={13} fw={500} color="#B1C7FC">
                    Your loss
                  </Text>
                  <Flex jc="flex-end" gap="4">
                    <Text fz={13} fw={500} color="#E4F2FF">
                      {userLossDEXE} DEXE
                    </Text>
                    <Text fz={13} fw={500} color="#B1C7FC">
                      <>($ {userLossUSD.format})</>
                    </Text>
                  </Flex>
                </Flex>
                <Flex full jc="space-between">
                  <Text fz={13} fw={500} color="#B1C7FC">
                    Your insurance coverage
                  </Text>
                  <Flex jc="flex-end" gap="4">
                    <Text fz={13} fw={500} color="#E4F2FF">
                      {userCoverageDEXE.format} DEXE
                    </Text>
                    <Text fz={13} fw={500} color="#B1C7FC">
                      <>($ {userCoverageUSD})</>
                    </Text>
                  </Flex>
                </Flex>
              </S.DataBlock>
              <S.DataBlock>
                <Flex m="0 0 16px" full jc="space-between">
                  <Text fz={13} fw={500} color="#B1C7FC">
                    Total loss
                  </Text>
                  <Flex jc="flex-end" gap="4">
                    <Text fz={13} fw={500} color="#E4F2FF">
                      {totalLossDEXE} DEXE
                    </Text>
                    <Text fz={13} fw={500} color="#B1C7FC">
                      ($ {totalLossUSD})
                    </Text>
                  </Flex>
                </Flex>
                <Flex full jc="space-between">
                  <Text fz={13} fw={500} color="#B1C7FC">
                    Insurance coverage
                  </Text>
                  <Flex jc="flex-end" gap="4">
                    <Text fz={13} fw={500} color="#E4F2FF">
                      {totalCoverageDEXE} DEXE
                    </Text>
                    <Text fz={13} fw={500} color="#B1C7FC">
                      ($ {totalCoverageUSD})
                    </Text>
                  </Flex>
                </Flex>
              </S.DataBlock>
              <S.DataBlock>
                <Flex full jc="space-between">
                  <Flex>
                    <Text fz={13} fw={500} color="#B1C7FC">
                      Insurance treasury/3
                    </Text>
                  </Flex>

                  <Flex jc="flex-end" gap="4">
                    <Text fz={13} fw={500} color="#E4F2FF">
                      {normalizeBigNumber(insuranceTreasuryDEXE, 18, 3)} DEXE
                    </Text>
                    <Text fz={13} fw={500} color="#B1C7FC">
                      ($ {normalizeBigNumber(insuranceTreasuryUSD, 18, 2)})
                    </Text>
                  </Flex>
                </Flex>
              </S.DataBlock>
            </div>
          </CIACard.Container>
        </Flex>

        <Flex full>
          <CIACard.Container p="16px">
            <CreateInsuranceAccidentCardHead
              icon={<Icon name={ICON_NAMES.fileDock} />}
              title="Describe the problem"
            />
            <CIACard.Description>
              <p>
                Describe your problem. A thorough and concise description helps
                DAO members make the right decision when voting on it.
              </p>
            </CIACard.Description>
            <TextareaField
              value={description.get}
              setValue={description.set}
              label="Description"
              errorMessage={getFieldErrorMessage("description")}
              onBlur={() => touchField("description")}
            />
          </CIACard.Container>
        </Flex>

        <Flex full>
          <CIACard.Container p="16px">
            <CreateInsuranceAccidentCardHead
              icon={<Icon name={ICON_NAMES.fileDock} />}
              title="Add chat for the discussion"
            />
            <CIACard.Description>
              <p>
                Создайте и прикрепите чат в котором будет вестись обсуждение по
                указанному случаю. Это может быть Telegram-чат или ветка в
                Discord
              </p>
            </CIACard.Description>
            <InputField
              value={chat.get}
              setValue={chat.set}
              label="Chat"
              placeholder="www.xxxx.com/"
              nodeRight={
                <AppButton
                  type="button"
                  text="paste"
                  color="default"
                  size="no-paddings"
                  onClick={() => pasteFromClipboard(chat.set)}
                >
                  Paste
                </AppButton>
              }
              errorMessage={getFieldErrorMessage("chat")}
              onBlur={() => touchField("chat")}
            />
          </CIACard.Container>
        </Flex>
      </StepsRoot>
      <StepsBottomNavigation />
    </>
  )
}

export default CreateInsuranceAccidentAddDescriptionStep
