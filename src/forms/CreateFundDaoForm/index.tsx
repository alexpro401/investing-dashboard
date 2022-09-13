import { FC, useCallback, useMemo, useState } from "react"
import { Container } from "./styled"
import CreateFundDaoTitlesStep from "./steps/CreateFundDaoTitlesStep"
import { CreateFundDaoStepsController } from "./components"

import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import { useDaoPoolCreatingForm } from "./useDaoPoolCreatingForm"
import { useForm } from "hooks/useForm"
import { useNavigate } from "react-router-dom"

enum STEPS {
  titles = "titles",
  internalProposal = "internal-proposal",
  distributionProposalSettings = "distribution-proposal-settings",
  validatorsBalancesSettings = "validators-balances-settings",
  defaultProposalSetting = "default-proposal-setting",
}

const CreateFundDaoForm: FC = () => {
  const daoPoolCreatingForm = useDaoPoolCreatingForm()

  const [currentStep, setCurrentStep] = useState(STEPS.titles)

  const totalStepsCount = useMemo(() => Object.values(STEPS).length, [])
  const currentStepNumber = useMemo(
    () => Object.values(STEPS).indexOf(currentStep) + 1,
    [currentStep]
  )

  const formController = useForm()

  const navigate = useNavigate()

  const handleNextStep = () => {
    switch (currentStep) {
      case STEPS.titles:
        setCurrentStep(STEPS.internalProposal)
        break
      case STEPS.internalProposal:
        setCurrentStep(STEPS.distributionProposalSettings)
        break
      case STEPS.distributionProposalSettings:
        setCurrentStep(STEPS.validatorsBalancesSettings)
        break
      case STEPS.validatorsBalancesSettings:
        setCurrentStep(STEPS.defaultProposalSetting)
        break
      case STEPS.defaultProposalSetting:
        submit()
    }
  }

  const handlePrevStep = () => {
    switch (currentStep) {
      case STEPS.defaultProposalSetting:
        setCurrentStep(STEPS.validatorsBalancesSettings)
        break
      case STEPS.validatorsBalancesSettings:
        setCurrentStep(STEPS.distributionProposalSettings)
        break
      case STEPS.distributionProposalSettings:
        setCurrentStep(STEPS.internalProposal)
        break
      case STEPS.internalProposal:
        setCurrentStep(STEPS.titles)
        break
      case STEPS.titles:
        navigate("/create-fund")
    }
  }

  const submit = useCallback(() => {
    formController.disableForm()
    try {
    } catch (error) {
      console.error(error)
    }
    formController.enableForm()
  }, [formController])

  return (
    <FundDaoCreatingContext.Provider value={daoPoolCreatingForm}>
      <Container>
        <CreateFundDaoTitlesStep />

        <CreateFundDaoStepsController
          totalStepsCount={totalStepsCount}
          currentStepNumber={currentStepNumber}
          nextCb={handleNextStep}
          prevCb={handlePrevStep}
        />
      </Container>
    </FundDaoCreatingContext.Provider>
  )
}

export default CreateFundDaoForm
