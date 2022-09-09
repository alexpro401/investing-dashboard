import Header from "components/Header/Layout"
import CreateFundContext from "../../context/CreateFundContext"
import CreateFundForm from "../../forms/CreateFundForm"

import { FC } from "react"
import { Container } from "../CreateFundBasic/styled"

const CreateFundDaoPool: FC = () => {
  return (
    <>
      <Header>Create Fund Investment</Header>
      <Container>
        <CreateFundContext>
          <CreateFundForm presettedFundType="investment" />
        </CreateFundContext>
      </Container>
    </>
  )
}

export default CreateFundDaoPool
