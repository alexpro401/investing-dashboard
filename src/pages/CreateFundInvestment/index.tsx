import Header from "components/Header/Layout"
import CreateFundContext from "../../context/CreateFundContext"
import CreateFundForm from "../../forms/CreateFundForm"

import { FC } from "react"
import { Container } from "../CreateFundBasic/styled"

const CreateFundDaoPool: FC = () => {
  return (
    <>
      <Header>Create Fund Investment</Header>
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <CreateFundContext>
          <CreateFundForm presettedFundType="investment" />
        </CreateFundContext>
      </Container>
    </>
  )
}

export default CreateFundDaoPool
