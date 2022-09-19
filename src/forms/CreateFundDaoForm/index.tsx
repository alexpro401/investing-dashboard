import { FC, useCallback, useMemo, useState } from "react"
import { Container } from "./styled"
import { CreateFundDaoStepsController } from "./components"
import { TitlesStep, IsDaoValidatorStep, InternalProposalStep } from "./steps"

import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import { useDaoPoolCreatingForm } from "./useDaoPoolCreatingForm"
import { useForm } from "hooks/useForm"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { opacityVariants } from "motion/variants"

enum STEPS {
  titles = "titles",
  isValidatorSelecting = "is-validator-selecting",
  internalProposal = "internal-proposal",
  distributionProposalSettings = "distribution-proposal-settings",
  isCustomVoteSelecting = "is-custom-vote-selecting",
  validatorsBalancesSettings = "validators-balances-settings",
  isTokenDistributionSettings = "",
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
        setCurrentStep(STEPS.isValidatorSelecting)
        break
      case STEPS.isValidatorSelecting:
        // TODO: check isValidatorSelected
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
        setCurrentStep(STEPS.isValidatorSelecting)
        break
      case STEPS.isValidatorSelecting:
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
        <AnimatePresence>
          {currentStep === STEPS.titles ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              variants={opacityVariants}
            >
              <TitlesStep />
            </motion.div>
          ) : currentStep === STEPS.isValidatorSelecting ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              variants={opacityVariants}
            >
              <IsDaoValidatorStep />
            </motion.div>
          ) : currentStep === STEPS.internalProposal ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              variants={opacityVariants}
            >
              <InternalProposalStep />
            </motion.div>
          ) : currentStep === STEPS.distributionProposalSettings ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              variants={opacityVariants}
            >
              3
            </motion.div>
          ) : currentStep === STEPS.validatorsBalancesSettings ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              variants={opacityVariants}
            >
              4
            </motion.div>
          ) : currentStep === STEPS.defaultProposalSetting ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              variants={opacityVariants}
            >
              5
            </motion.div>
          ) : (
            <></>
          )}
        </AnimatePresence>

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
