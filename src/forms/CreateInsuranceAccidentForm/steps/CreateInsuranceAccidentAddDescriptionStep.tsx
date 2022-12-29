import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
} from "react"
import { isEmpty, isNil } from "lodash"
import { useWeb3React } from "@web3-react/core"
import { v4 as uuidv4 } from "uuid"

import CreateInsuranceAccidentCardStepNumber from "forms/CreateInsuranceAccidentForm/components/CreateInsuranceAccidentCardStepNumber"

import * as S from "../styled/step-add-description"

import {
  StepsRoot,
  CreateInsuranceAccidentTopCard,
  CreateInsuranceAccidentTopCardHead,
  CreateInsuranceAccidentTopCardDescription,
} from "forms/CreateInsuranceAccidentForm/styled"
import { InsuranceAccidentCreatingContext } from "context/InsuranceAccidentCreatingContext"
import { Flex } from "theme"
import { normalizeBigNumber } from "utils"
import { divideBignumbers, multiplyBignumbers } from "utils/formulas"
import { BigNumber } from "@ethersproject/bignumber"
import { ZERO } from "constants/index"
import { ICON_NAMES } from "constants/icon-names"
import { AppButton, Icon, Card, CardDescription, CardHead } from "common"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { selectDexeAddress } from "state/contracts/selectors"
import { useSelector } from "react-redux"
import { InputField, TextareaField } from "fields"
import { readFromClipboard } from "utils/clipboard"
import Tooltip from "components/Tooltip"
import { useInsuranceAccidentTotals } from "hooks/useInsurance"
import { useBreakpoints } from "hooks"

const CreateInsuranceAccidentAddDescriptionStep: FC = () => {
  const { isMobile } = useBreakpoints()
  const { account } = useWeb3React()
  const { form, investorsTotals, investorsInfo } = useContext(
    InsuranceAccidentCreatingContext
  )
  const { chat, description } = form

  const dexeAddress = useSelector(selectDexeAddress)
  const dexePrice = useTokenPriceOutUSD({
    tokenAddress: dexeAddress,
  })

  const _inDayLpAmount = useMemo(() => {
    if (
      isNil(account) ||
      isNil(investorsInfo.get) ||
      isEmpty(investorsInfo.get)
    ) {
      return ZERO
    }

    return BigNumber.from(
      investorsInfo.get[String(account).toLocaleLowerCase()]
        .poolPositionBeforeAccident.lpHistory[0].currentLpAmount
    )
  }, [account, investorsInfo])

  const _currentLPAmount = useMemo(() => {
    if (isNil(account) || isNil(investorsInfo.get)) return ZERO

    return divideBignumbers(
      [
        BigNumber.from(
          investorsInfo.get[String(account).toLocaleLowerCase()]
            .poolPositionOnAccidentCreation.totalLPInvestVolume
        ),
        18,
      ],
      [
        BigNumber.from(
          investorsInfo.get[String(account).toLocaleLowerCase()]
            .poolPositionOnAccidentCreation.totalLPDivestVolume
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
      isNil(account) ||
      isNil(investorsInfo.get) ||
      isNil(investorsInfo.get[String(account).toLocaleLowerCase()])
    ) {
      return { big: ZERO, format: "0.0" }
    }

    const big = BigNumber.from(
      investorsInfo.get[String(account).toLocaleLowerCase()].stake
    ).mul(10)
    return { big, format: normalizeBigNumber(big, 18, 3) }
  }, [account, investorsInfo])

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

  const {
    insuranceTreasuryDEXE,
    insuranceTreasuryUSD,
    totalLossDEXE,
    totalLossUSD,
    totalCoverageDEXE,
    totalCoverageUSD,
  } = useInsuranceAccidentTotals(investorsTotals.get)

  const pasteFromClipboard = useCallback(
    async (dispatchCb: Dispatch<SetStateAction<any>>) => {
      dispatchCb(await readFromClipboard())
    },
    []
  )

  return (
    <>
      <StepsRoot>
        <CreateInsuranceAccidentTopCard>
          <CreateInsuranceAccidentTopCardHead
            nodeLeft={
              isMobile && <CreateInsuranceAccidentCardStepNumber number={4} />
            }
            title="Proposal summary"
          />
          <CreateInsuranceAccidentTopCardDescription>
            <p>
              Для финализации и создания пропоузала еще раз проверьте данные по
              компенсации, опишите страховую проблему, а также привяжите чат для
              обсуждения
            </p>
          </CreateInsuranceAccidentTopCardDescription>
        </CreateInsuranceAccidentTopCard>

        <S.DataCard>
          {isMobile && (
            <CardHead
              nodeLeft={<Icon name={ICON_NAMES.fileDock} />}
              title="Дані"
            />
          )}
          <div>
            <S.DataBlock>
              <S.DataLabel>Your loss</S.DataLabel>
              <S.DataValue>
                {userLossDEXE}
                {isMobile && " DEXE"}
                <span>
                  {isMobile && "("}$ {userLossUSD.format}
                  {isMobile && ")"}
                </span>
              </S.DataValue>
            </S.DataBlock>
            <S.DataBlock full jc="space-between">
              <S.DataLabel>Your insurance coverage</S.DataLabel>
              <S.DataValue>
                {userCoverageDEXE.format}
                {isMobile && " DEXE"}
                <span>
                  <>
                    {isMobile && "("}$ {userCoverageUSD}
                    {isMobile && ")"}
                  </>
                </span>
              </S.DataValue>
            </S.DataBlock>
            <S.DataBlock>
              <S.DataLabel>Total loss</S.DataLabel>
              <S.DataValue>
                {normalizeBigNumber(totalLossDEXE, 18, 3)}
                {isMobile && " DEXE"}
                <span>
                  {isMobile && "("}$ {normalizeBigNumber(totalLossUSD, 18, 3)}
                  {isMobile && ")"}
                </span>
              </S.DataValue>
            </S.DataBlock>
            <S.DataBlock>
              <S.DataLabel>Insurance coverage</S.DataLabel>
              <S.DataValue>
                {normalizeBigNumber(totalCoverageDEXE, 18, 3)}
                {isMobile && " DEXE"}
                <span>
                  {isMobile && "("}${" "}
                  {normalizeBigNumber(totalCoverageUSD, 18, 3)}
                  {isMobile && ")"}
                </span>
              </S.DataValue>
            </S.DataBlock>
            <S.DataBlock>
              <S.DataLabel>
                <Flex ai="center" gap="6">
                  <Tooltip id={uuidv4()}>
                    Insurance treasury explanation
                  </Tooltip>
                  <span>Insurance treasury/3</span>
                </Flex>
              </S.DataLabel>
              <S.DataValue>
                {normalizeBigNumber(insuranceTreasuryDEXE, 18, 3)}
                {isMobile && " DEXE"}
                <span>
                  {isMobile && "("}${" "}
                  {normalizeBigNumber(insuranceTreasuryUSD, 18, 2)}
                  {isMobile && ")"}
                </span>
              </S.DataValue>
            </S.DataBlock>
          </div>
        </S.DataCard>

        <Card>
          <CardHead
            nodeLeft={<Icon name={ICON_NAMES.fileDock} />}
            title="Describe the problem"
          />
          <CardDescription>
            <p>
              Describe your problem. A thorough and concise description helps
              DAO members make the right decision when voting on it.
            </p>
          </CardDescription>
          <TextareaField
            value={description.get}
            setValue={description.set}
            label="Description"
          />
        </Card>

        <Card>
          <CardHead
            nodeLeft={<Icon name={ICON_NAMES.chatOutline} />}
            title="Add chat for the discussion"
          />
          <CardDescription>
            <p>
              Создайте и прикрепите чат в котором будет вестись обсуждение по
              указанному случаю. Это может быть Telegram-чат или ветка в Discord
            </p>
          </CardDescription>
          <InputField
            value={chat.get}
            setValue={chat.set}
            label="Chat"
            nodeRight={
              <AppButton
                type="button"
                text="paste"
                color="default"
                size="no-paddings"
                onClick={() => pasteFromClipboard(chat.set)}
              />
            }
          />
        </Card>
      </StepsRoot>
    </>
  )
}

export default CreateInsuranceAccidentAddDescriptionStep
