import { FC } from "react"
import { Container } from "./styled"
import CreateFundDaoTitlesStep from "./CreateFundDaoTitlesStep"
import CreateFundDaoStepsController from "./CreateFundDaoStepsController"
import { FundDaoCreatingContext } from "./FundDaoCreatingContext"
import { useDaoPoolCreatingForm } from "./useDaoPoolCreatingForm"

enum STEPS {
  titles = "titles",
  internalProposal = "internal-proposal",
  distributionProposalSettings = "distribution-proposal-settings",
  validatorsBalancesSettings = "validators-balances-settings",
  defaultProposalSetting = "default-proposal-setting",
}

const CreateFundDaoForm: FC = () => {
  const daoPoolCreatingForm = useDaoPoolCreatingForm()

  return (
    <FundDaoCreatingContext.Provider value={daoPoolCreatingForm}>
      <Container>
        <CreateFundDaoTitlesStep />

        <CreateFundDaoStepsController />
      </Container>
    </FundDaoCreatingContext.Provider>
  )
}

export default CreateFundDaoForm
