import { FC, useContext } from "react"
import { CreateDaoPoolParameters } from "../components"
import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"

const InternalProposalStep: FC = () => {
  const { internalProposalForm } = useContext(FundDaoCreatingContext)

  return (
    <>
      {internalProposalForm ? (
        <CreateDaoPoolParameters poolParameters={internalProposalForm} />
      ) : (
        <></>
      )}
    </>
  )
}

export default InternalProposalStep
