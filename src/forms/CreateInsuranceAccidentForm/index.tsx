import { isEmpty, isNil } from "lodash"
import { BigNumber } from "@ethersproject/bignumber"
import { createClient, Provider as GraphProvider } from "urql"
import { FC, useCallback, useEffect, useMemo, useState } from "react"

import { useForm } from "hooks/useForm"
import { InsuranceAccidentCreatingContext } from "context/InsuranceAccidentCreatingContext"

import useAlert from "hooks/useAlert"
import { normalizeBigNumber } from "utils"
import { AlertType } from "context/AlertContext"
import useInsurance, { useInsuranceDueDay } from "hooks/useInsurance"
import { useInsuranceAccidentCreatingForm } from "./useInsuranceAccidentCreatingForm"

import * as S from "./styled"
import NoEnoughInsurance from "modals/NoEnoughInsurance"
import CreateInsuranceAccidentChooseFundStep from "./steps/CreateInsuranceAccidentChooseFundStep"
import CreateInsuranceAccidentChooseBlockStep from "./steps/CreateInsuranceAccidentChooseBlockStep"
import CreateInsuranceAccidentCheckSettingsStep from "./steps/CreateInsuranceAccidentCheckSettingsStep"
import CreateInsuranceAccidentAddDescriptionStep from "./steps/CreateInsuranceAccidentAddDescriptionStep"
import CreateInsuranceAccidentStepsController from "./components/CreateInsuranceAccidentStepsController"

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
  const { context } = useInsuranceAccidentCreatingForm()
  const formController = useForm()
  const [showAlert] = useAlert()

  const [insuranceBalances, insuranceLoading] = useInsurance()
  const [showNotEnoughInsurance, setShowNotEnoughInsurance] = useState(false)
  const [showNotEnoughInsuranceByDay, setShowNotEnoughInsuranceByDay] =
    useState(false)

  const dayFromDate = useMemo(() => {
    if (!context.form?.date.get || isEmpty(context.form?.date.get)) {
      return undefined
    }

    return Math.floor(Number(context.form?.date.get) / 86400)
  }, [context])

  const [dueDay] = useInsuranceDueDay(String(dayFromDate))

  const notEnoughInsurance = useMemo(() => {
    if (insuranceLoading) return false

    return (
      Number(normalizeBigNumber(insuranceBalances.insuranceDexe, 18, 6)) < 1000
    )
  }, [insuranceLoading, insuranceBalances])

  useEffect(() => {
    setShowNotEnoughInsurance(notEnoughInsurance)
  }, [notEnoughInsurance])

  useEffect(() => {
    if (!isNil(dueDay) && dueDay.data?.stake) {
      const isInsuranceGreaterThanHundred =
        Number(normalizeBigNumber(BigNumber.from(dueDay.data?.stake))) >= 100
      setShowNotEnoughInsuranceByDay(!isInsuranceGreaterThanHundred)
    }
  }, [dueDay])

  useEffect(() => {
    if (
      !isNil(dueDay) &&
      !isNil(dueDay.data) &&
      !isNil(context.insuranceDueDate)
    ) {
      context.insuranceDueDate.set(dueDay.data)
    }
  }, [dueDay, context])

  useEffect(() => {
    return () => {
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
    formController.disableForm()
    try {
      // TODO: 1) Prepare and save data to IPFS
      // TODO: 2) Save URL from IPFS to chain
    } catch (error) {
      console.error(error)
    } finally {
      formController.enableForm()
    }
  }, [formController])

  const handleNextStep = () => {
    if (notEnoughInsurance) return

    switch (currentStep) {
      case STEPS.chooseFund:
        if (isEmpty(context.form.pool.get)) {
          showAlert({
            content:
              "Before continue choose pool where accident has been happens",
            type: AlertType.warning,
            hideDuration: 10000,
          })
          break
        }
        if (!context.insuranceAccidentExist.get) {
          setCurrentStep(STEPS.chooseBlock)
        }
        break
      case STEPS.chooseBlock:
        if (isEmpty(context.form.block.get) || isEmpty(context.form.date.get)) {
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
        setCurrentStep(STEPS.addDescription)
        break
      case STEPS.addDescription:
        if (
          isEmpty(context.form.description.get) ||
          isEmpty(context.form.chat.get)
        ) {
          let message = ""

          if (
            isEmpty(context.form.description.get) &&
            isEmpty(context.form.chat.get)
          ) {
            message = `Before continue add description of the accident and link to chat where investors can talk about accident.`
          } else if (isEmpty(context.form.description.get)) {
            message = `Before continue add description of the accident.`
          } else if (isEmpty(context.form.chat.get)) {
            message = `Before continue add link to chat where investors can talk about accident.`
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

  const step = useMemo(() => {
    switch (currentStep) {
      case STEPS.chooseFund:
        return <CreateInsuranceAccidentChooseFundStep />
      case STEPS.chooseBlock:
        return <CreateInsuranceAccidentChooseBlockStep />
      case STEPS.checkSettings:
        return <CreateInsuranceAccidentCheckSettingsStep />
      case STEPS.addDescription:
        return <CreateInsuranceAccidentAddDescriptionStep />
    }
  }, [currentStep])

  return (
    <InsuranceAccidentCreatingContext.Provider value={context}>
      <S.Container>
        {step}
        <CreateInsuranceAccidentStepsController
          totalStepsCount={totalStepsCount}
          currentStepNumber={currentStepNumber}
          nextCb={handleNextStep}
          prevCb={handlePrevStep}
        />
        <NoEnoughInsurance
          isOpen={showNotEnoughInsurance}
          onClose={() => setShowNotEnoughInsurance(false)}
        />
      </S.Container>
    </InsuranceAccidentCreatingContext.Provider>
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
