import { isEmpty, isNil, reduce } from "lodash"
import { BigNumber, BigNumberish } from "@ethersproject/bignumber"
import { createClient, Provider as GraphProvider } from "urql"
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import { useForm } from "hooks/useForm"
import useError from "hooks/useError"
import useAlert from "hooks/useAlert"
import { isTxMined, normalizeBigNumber, parseTransactionError } from "utils"
import { AlertType } from "context/AlertContext"
import useInsurance, { useInsuranceDueDay } from "hooks/useInsurance"

import * as S from "./styled"
import NoEnoughInsurance from "modals/NoEnoughInsurance"
import CreateInsuranceAccidentChooseFundStep from "./steps/CreateInsuranceAccidentChooseFundStep"
import CreateInsuranceAccidentChooseBlockStep from "./steps/CreateInsuranceAccidentChooseBlockStep"
import CreateInsuranceAccidentCheckSettingsStep from "./steps/CreateInsuranceAccidentCheckSettingsStep"
import CreateInsuranceAccidentAddDescriptionStep from "./steps/CreateInsuranceAccidentAddDescriptionStep"
import { InsuranceAccidentCreatingContext } from "context/InsuranceAccidentCreatingContext"
import { AnimatePresence } from "framer-motion"
import { useWeb3React } from "@web3-react/core"
import { useFormValidation } from "hooks/useFormValidation"
import { isUrl, required } from "utils/validators"
import { useGovPoolContract } from "contracts"
import { TransactionType } from "state/transactions/types"
import { useTransactionAdder } from "state/transactions/hooks"
import usePayload from "hooks/usePayload"
import { SubmitState } from "constants/types"
import CreateInsuranceAccidentCreatedSuccessfully from "./components/CreateInsuranceAccidentCreatedSuccessfully"
import { ZERO } from "constants/index"
import { IpfsEntity } from "utils/ipfsEntity"
import { useSelector } from "react-redux"
import { selectInsuranceAddress } from "state/contracts/selectors"
import { encodeAbiMethod } from "utils/encodeAbi"
import { Insurance as Insurance_ABI } from "abi"
import { divideBignumbers } from "utils/formulas"

console.log(process.env.REACT_APP_DEXE_DAO_ADDRESS)

const investorsPoolsClient = createClient({
  url: process.env.REACT_APP_INVESTORS_API_URL || "",
})

enum STEPS {
  chooseFund = "choose-fund",
  chooseBlock = "choose-block",
  checkSettings = "check-settings",
  addDescription = "add-description",
}

const CreateInsuranceAccidentForm: FC = () => {
  const { account } = useWeb3React()
  const context = useContext(InsuranceAccidentCreatingContext)
  const {
    form,
    chart,
    insuranceDueDate,
    investorsTotals,
    insuranceAccidentExist,
    investorsInfo,
    insurancePoolHaveTrades,
    _clearState,
  } = context

  const { pool, block, date, description, chat } = form

  const formController = useForm()
  const { isFieldsValid, getFieldErrorMessage, touchField, touchForm } =
    useFormValidation(
      {
        pool: pool.get,
        block: block.get,
        date: date.get,
        description: description.get,
        chat: chat.get,
      },
      {
        pool: { required },
        block: { required },
        date: { required },
        description: { required },
        chat: { required, isUrl },
      }
    )

  useEffect(() => {
    touchField("pool")
  }, [pool])
  useEffect(() => {
    touchField("block")
  }, [block])
  useEffect(() => {
    touchField("date")
  }, [date])
  useEffect(() => {
    touchField("description")
  }, [description])
  useEffect(() => {
    touchField("chat")
  }, [chat])

  const [, setAccidentCreating] = usePayload()
  const [showAlert] = useAlert()
  const [, setError] = useError()
  const [insuranceBalances, insuranceLoading] = useInsurance()
  const addTransaction = useTransactionAdder()
  const insuranceAddress = useSelector(selectInsuranceAddress)
  const govPool = useGovPoolContract(process.env.REACT_APP_DEXE_DAO_ADDRESS)

  const [newAccidentHash, setNewAccidentHash] = useState("")
  const [showSuccessfullyCreatedModal, setShowSuccessfullyCreatedModal] =
    useState(false)
  const [showNotEnoughInsurance, setShowNotEnoughInsurance] = useState(false)
  const [showNotEnoughInsuranceByDay, setShowNotEnoughInsuranceByDay] =
    useState(false)

  const dayFromDate = useMemo(() => {
    if (isEmpty(date.get)) return ""
    return Math.floor(Number(date.get) / 86400)
  }, [date])

  const [dueDay] = useInsuranceDueDay(String(dayFromDate))

  const notEnoughInsurance = useMemo(() => {
    if (insuranceLoading) return false

    return insuranceBalances.insuranceDexe.lt(1000)
  }, [insuranceLoading, insuranceBalances])

  useEffect(() => {
    setShowNotEnoughInsurance(notEnoughInsurance)
  }, [notEnoughInsurance])

  useEffect(() => {
    if (!isEmpty(dueDay.data) && !isNil(dueDay.data?.stake)) {
      const isInsuranceGreaterThanHundred =
        Number(normalizeBigNumber(BigNumber.from(dueDay.data.stake))) >= 100
      setShowNotEnoughInsuranceByDay(!isInsuranceGreaterThanHundred)
    }
  }, [dueDay])

  useEffect(() => {
    if (!isEmpty(dueDay.data)) {
      insuranceDueDate.set(dueDay.data)
    }
  }, [dueDay, insuranceDueDate])

  useEffect(() => {
    return () => {
      _clearState()
      setShowNotEnoughInsurance(false)
      setShowNotEnoughInsuranceByDay(false)
    }
  }, [])

  const [currentStep, setCurrentStep] = useState(STEPS.chooseFund)
  const totalStepsCount = useMemo(() => Object.values(STEPS).length, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 1,
    [currentStep]
  )

  const submit = useCallback(async () => {
    touchForm()
    if (!account || !isFieldsValid || !govPool) {
      return
    }

    formController.disableForm()
    setAccidentCreating(SubmitState.SIGN)
    try {
      const insuranceProposalData = new IpfsEntity({
        data: JSON.stringify({
          creator: String(account).toLocaleLowerCase(),
          timestamp: new Date().getTime() / 1000,
          accidentInfo: {
            pool: pool.get,
            block: block.get,
            date: date.get,
            description: description.get,
            chat: chat.get,
          },
          investorsTotals: investorsTotals.get,
          investorsInfo: investorsInfo.get,
          chart: {
            data: chart.data.get,
            point: chart.point.get,
            forPool: chart.forPool.get,
            timeframe: chart.timeframe.get,
          },
        }),
      })

      await insuranceProposalData.uploadSelf()

      if (!isNil(insuranceProposalData._path)) {
        setNewAccidentHash(insuranceProposalData._path)
        setAccidentCreating(SubmitState.WAIT_CONFIRM)

        const investorsWithAmounts = reduce(
          Object.keys(investorsInfo.get),
          (acc, investorKey) => {
            const investorData = investorsInfo.get[investorKey]

            const {
              poolPositionBeforeAccident,
              poolPositionOnAccidentCreation,
            } = investorData

            const { totalLPInvestVolume, totalLPDivestVolume } =
              poolPositionOnAccidentCreation

            const _inDayLPAmount = BigNumber.from(
              poolPositionBeforeAccident.lpHistory[0].currentLpAmount
            )

            const _currentLPAmount = divideBignumbers(
              [BigNumber.from(totalLPInvestVolume), 18],
              [BigNumber.from(totalLPDivestVolume), 18]
            )

            const loss = divideBignumbers(
              [_inDayLPAmount, 18],
              [_currentLPAmount, 18]
            )

            acc.investors.push(investorKey)
            acc.amounts.push(loss.toString())

            return acc
          },
          { investors: [] as string[], amounts: [] as BigNumberish[] }
        )

        const encodedProposalExecution = encodeAbiMethod(
          Insurance_ABI,
          "acceptClaim",
          [
            insuranceProposalData._path,
            investorsWithAmounts.investors,
            investorsWithAmounts.amounts,
          ]
        )

        const receipt = await govPool.createProposal(
          "ipfs://" + insuranceProposalData._path,
          [insuranceAddress],
          [BigNumber.from(0).toHexString()],
          [encodedProposalExecution]
        )

        const tx = await addTransaction(receipt, {
          type: TransactionType.INSURANCE_REGISTER_PROPOSAL_CLAIM,
          pool: pool.get,
        })

        if (isTxMined(tx)) {
          setAccidentCreating(SubmitState.SUCCESS)
          setShowSuccessfullyCreatedModal(true)
        }
      }
    } catch (error: any) {
      if (!!error && !!error.data && !!error.data.message) {
        setError(error.data.message)
      } else {
        const errorMessage = parseTransactionError(error.toString())
        !!errorMessage && setError(errorMessage)
      }
    } finally {
      formController.enableForm()
      setAccidentCreating(SubmitState.IDLE)
    }
  }, [
    account,
    addTransaction,
    block,
    chart,
    date,
    description,
    formController,
    investorsInfo,
    investorsTotals,
    isFieldsValid,
    touchForm,
    pool,
    govPool,
  ])

  const handleNextStep = () => {
    if (notEnoughInsurance) return

    switch (currentStep) {
      case STEPS.chooseFund:
        if (!isEmpty(getFieldErrorMessage("pool"))) {
          showAlert({
            content:
              "Before continue choose pool where accident has been happens",
            type: AlertType.warning,
            hideDuration: 10000,
          })
          break
        }
        if (insuranceAccidentExist.get) {
          showAlert({
            content: "Insurance accident for chosen pool already exist.",
            type: AlertType.warning,
            hideDuration: 10000,
          })
          break
        }
        if (!insurancePoolHaveTrades.get) {
          showAlert({
            content:
              "Chosen fund have no trades. You can't create insurance accident proposal on pool without trades.",
            type: AlertType.warning,
            hideDuration: 10000,
          })
          break
        }

        setCurrentStep(STEPS.chooseBlock)
        break
      case STEPS.chooseBlock:
        if (
          !isEmpty(getFieldErrorMessage("block")) ||
          !isEmpty(getFieldErrorMessage("date"))
        ) {
          showAlert({
            content:
              "Before continue choose closest block or date before accident has been happens",
            type: AlertType.warning,
            hideDuration: 10000,
          })
          break
        }
        if (showNotEnoughInsuranceByDay) {
          showAlert({
            content:
              "Do not have insurance for this day. Please choose another one.",
            type: AlertType.warning,
            hideDuration: 10000,
          })
          break
        }

        setCurrentStep(STEPS.checkSettings)
        break
      case STEPS.checkSettings:
        if (isEmpty(investorsInfo.get)) {
          showAlert({
            content:
              "Chosen fund have no investments. You can't create insurance accident proposal on pool without trading.",
            type: AlertType.warning,
            hideDuration: 10000,
          })
          break
        }

        setCurrentStep(STEPS.addDescription)
        break
      case STEPS.addDescription:
        const descriptionInvalid = !isEmpty(getFieldErrorMessage("description"))
        const chatInvalid = !isEmpty(getFieldErrorMessage("chat"))

        if (descriptionInvalid || chatInvalid) {
          let message = ""
          if (descriptionInvalid && chatInvalid) {
            message = `Before continue add description of the accident and link to chat where investors can talk about accident.`
          } else if (descriptionInvalid) {
            message = `Before continue add description of the accident.`
          } else if (chatInvalid) {
            message = `Before continue add link to chat where investors can talk about accident. ${getFieldErrorMessage(
              "chat"
            )}.`
          }

          showAlert({
            content: message,
            type: AlertType.warning,
            hideDuration: 10000,
          })
          break
        }

        submit()
        break
      default:
        break
    }
  }

  const handlePrevStep = () => {
    switch (currentStep) {
      case STEPS.addDescription:
        setCurrentStep(STEPS.checkSettings)
        break
      case STEPS.checkSettings:
        investorsInfo.set({})
        investorsTotals.set({
          lp: ZERO.toHexString(),
          loss: ZERO.toHexString(),
          coverage: ZERO.toHexString(),
        })
        setCurrentStep(STEPS.chooseBlock)
        break
      case STEPS.chooseBlock:
        setCurrentStep(STEPS.chooseFund)
        break
      case STEPS.chooseFund:
      default:
        break
    }
  }

  return (
    <>
      <S.Container
        totalStepsAmount={totalStepsCount}
        currentStepNumber={currentStepNumber}
        prevCb={handlePrevStep}
        nextCb={handleNextStep}
      >
        <AnimatePresence>
          {currentStep === STEPS.chooseFund ? (
            <CreateInsuranceAccidentChooseFundStep />
          ) : currentStep === STEPS.chooseBlock ? (
            <CreateInsuranceAccidentChooseBlockStep />
          ) : currentStep === STEPS.checkSettings ? (
            <CreateInsuranceAccidentCheckSettingsStep />
          ) : currentStep === STEPS.addDescription ? (
            <CreateInsuranceAccidentAddDescriptionStep />
          ) : (
            <></>
          )}
        </AnimatePresence>
      </S.Container>
      <NoEnoughInsurance
        isOpen={showNotEnoughInsurance}
        onClose={() => setShowNotEnoughInsurance(false)}
      />
      <CreateInsuranceAccidentCreatedSuccessfully
        open={showSuccessfullyCreatedModal}
        setOpen={setShowSuccessfullyCreatedModal}
        url={newAccidentHash}
      />
    </>
  )
}

const CreateInsuranceAccidentFormWithProvider = (props) => {
  return (
    <GraphProvider value={investorsPoolsClient}>
      <CreateInsuranceAccidentForm {...props} />
    </GraphProvider>
  )
}

export default CreateInsuranceAccidentFormWithProvider
