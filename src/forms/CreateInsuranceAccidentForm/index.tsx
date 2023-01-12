import { isEmpty, isNil, reduce } from "lodash"
import { BigNumber, BigNumberish } from "@ethersproject/bignumber"
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  useForm,
  useError,
  useInsurance,
  useInsuranceDueDay,
  useBreakpoints,
} from "hooks"
import { useAlert } from "hooks"
import { isTxMined, normalizeBigNumber, parseTransactionError } from "utils"
import { AlertType } from "context/AlertContext"

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
import { SubmitState } from "consts/types"
import CreateInsuranceAccidentCreatedSuccessfully from "./components/CreateInsuranceAccidentCreatedSuccessfully"
import { ZERO } from "consts"
import { IpfsEntity } from "utils/ipfsEntity"
import { useDispatch, useSelector } from "react-redux"
import { selectInsuranceAddress } from "state/contracts/selectors"
import { encodeAbiMethod } from "utils/encodeAbi"
import { Insurance as Insurance_ABI } from "abi"
import { divideBignumbers } from "utils/formulas"
import { DEFAULT_ALERT_HIDDEN_TIMEOUT } from "consts/misc"
import { useActiveInsuranceProposalByPool } from "hooks/dao"
import InsuranceAccidentExist from "modals/InsuranceAccidentExist"
import { createPortal } from "react-dom"
import { SideStepsNavigationBar, StepsNavigation } from "common"
import { hideTapBar, showTabBar } from "state/application/actions"
import { useNavigate } from "react-router-dom"

enum STEPS {
  chooseFund = "choose-fund",
  chooseBlock = "choose-block",
  checkSettings = "check-settings",
  addDescription = "add-description",
}

const STEPS_TITLES: Record<STEPS, string> = {
  [STEPS.chooseFund]: "Basic fund",
  [STEPS.chooseBlock]: "Accident price",
  [STEPS.checkSettings]: "Accident summary",
  [STEPS.addDescription]: "Add Description",
}

const CreateInsuranceAccidentForm: FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [appNavigationEl, setAppNavigationEl] = useState<Element | null>(null)

  useEffect(() => {
    dispatch(hideTapBar())
    setTimeout(() => {
      setAppNavigationEl(document.querySelector("#app-navigation"))
    }, 100)

    return () => {
      dispatch(showTabBar())
    }
  }, [dispatch])

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
    insurancePoolLastPriceHistory,
    _clearState,
    clearFormStorage,
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
  const [accidentExistModal, setAccidentExistModal] = useState(false)

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
      setShowNotEnoughInsurance(false)
      setShowNotEnoughInsuranceByDay(false)
    }
  }, [])

  const [activeProposalByPool, loadingActiveProposalByPool] =
    useActiveInsuranceProposalByPool(pool.get)

  useEffect(() => {
    console.log({ activeProposalByPool, loadingActiveProposalByPool })
    if (loadingActiveProposalByPool) return

    const _exist =
      !isNil(activeProposalByPool) && !isEmpty(activeProposalByPool)

    insuranceAccidentExist.set(_exist)
    setAccidentExistModal(_exist)
  }, [activeProposalByPool, loadingActiveProposalByPool])

  const [currentStep, setCurrentStep] = useState(STEPS.chooseFund)
  const totalStepsCount = useMemo(() => Object.values(STEPS).length, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 1,
    [currentStep]
  )

  const submit = useCallback(async () => {
    touchForm()
    if (
      !account ||
      !isFieldsValid ||
      !govPool ||
      loadingActiveProposalByPool ||
      insuranceAccidentExist.get
    ) {
      return
    }

    formController.disableForm()
    setAccidentCreating(SubmitState.SIGN)
    try {
      const insuranceProposalData = new IpfsEntity({
        data: JSON.stringify({
          creator: String(account).toLocaleLowerCase(),
          timestamp: new Date().getTime() / 1000,
          form: {
            pool: pool.get,
            block: block.get,
            date: date.get,
            description: description.get,
            chat: chat.get,
          },
          insurancePoolLastPriceHistory: insurancePoolLastPriceHistory.get,
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
          pool.get,
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
          _clearState()
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
    insurancePoolLastPriceHistory,
    loadingActiveProposalByPool,
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
            hideDuration: DEFAULT_ALERT_HIDDEN_TIMEOUT,
          })
          break
        }
        if (loadingActiveProposalByPool) {
          showAlert({
            content: "Checking exist proposal for chose pool",
            type: AlertType.info,
            hideDuration: DEFAULT_ALERT_HIDDEN_TIMEOUT,
          })
          break
        }
        if (insuranceAccidentExist.get) {
          showAlert({
            content: "Insurance accident for chosen pool already exist.",
            type: AlertType.warning,
            hideDuration: DEFAULT_ALERT_HIDDEN_TIMEOUT,
          })
          break
        }
        if (!insurancePoolHaveTrades.get) {
          showAlert({
            content:
              "Chosen fund have no trades. You can't create insurance accident proposal on pool without trades.",
            type: AlertType.warning,
            hideDuration: DEFAULT_ALERT_HIDDEN_TIMEOUT,
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
            hideDuration: DEFAULT_ALERT_HIDDEN_TIMEOUT,
          })
          break
        }
        if (showNotEnoughInsuranceByDay) {
          showAlert({
            content:
              "Do not have insurance for this day. Please choose another one.",
            type: AlertType.warning,
            hideDuration: DEFAULT_ALERT_HIDDEN_TIMEOUT,
          })
          break
        }
        if (chart.data.get.length === 0) {
          showAlert({
            content: "Wait before fund data loaded",
            type: AlertType.warning,
            hideDuration: DEFAULT_ALERT_HIDDEN_TIMEOUT,
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
            hideDuration: DEFAULT_ALERT_HIDDEN_TIMEOUT,
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
            hideDuration: DEFAULT_ALERT_HIDDEN_TIMEOUT,
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
          users: "",
          lp: ZERO.toHexString(),
          loss: ZERO.toHexString(),
          coverage: ZERO.toHexString(),
          coverageUSD: ZERO.toHexString(),
        })
        setCurrentStep(STEPS.chooseBlock)
        break
      case STEPS.chooseBlock:
        setCurrentStep(STEPS.chooseFund)
        break
      case STEPS.chooseFund:
        navigate("/insurance")
        break
      default:
        break
    }
  }

  const { isMobile } = useBreakpoints()

  return (
    <>
      <S.Container
        totalStepsAmount={totalStepsCount}
        currentStepNumber={currentStepNumber}
        prevCb={handlePrevStep}
        nextCb={handleNextStep}
      >
        <AnimatePresence>
          <S.StepsWrapper>
            <S.StepsContainer>
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
              {appNavigationEl ? (
                createPortal(<StepsNavigation />, appNavigationEl)
              ) : !isMobile ? (
                <StepsNavigation />
              ) : (
                <></>
              )}
            </S.StepsContainer>

            {!isMobile ? (
              <SideStepsNavigationBar
                steps={Object.values(STEPS).map((step) => ({
                  number: Object.values(STEPS).indexOf(step),
                  title: STEPS_TITLES[step],
                }))}
                currentStep={Object.values(STEPS).indexOf(currentStep)}
              />
            ) : (
              <></>
            )}
          </S.StepsWrapper>
        </AnimatePresence>

        <NoEnoughInsurance
          isOpen={showNotEnoughInsurance}
          onClose={() => setShowNotEnoughInsurance(false)}
        />
        <InsuranceAccidentExist
          isOpen={accidentExistModal}
          onClose={() => setAccidentExistModal(false)}
          daoPool={activeProposalByPool?.query?.pool?.id ?? ""}
          proposalId={activeProposalByPool?.query?.proposalId ?? ""}
        />
        <CreateInsuranceAccidentCreatedSuccessfully
          open={showSuccessfullyCreatedModal}
          setOpen={setShowSuccessfullyCreatedModal}
          url={newAccidentHash}
          onVoteCallback={clearFormStorage}
        />
      </S.Container>
    </>
  )
}

export default CreateInsuranceAccidentForm
