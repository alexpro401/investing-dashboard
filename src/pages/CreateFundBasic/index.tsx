import Header from "components/Header/Layout"
import CreateFundContext from "../../context/CreateFundContext"
import CreateFundForm from "../../forms/CreateFundForm"

import { FC } from "react"
import { Container } from "./styled"

const CreateFundDaoPool: FC = () => {
  return (
    <>
      <Header>Create Fund basic</Header>
      <Container>
        <CreateFundContext>
          <CreateFundForm presettedFundType="basic" />
        </CreateFundContext>
      </Container>
    </>
  )
}

export default CreateFundDaoPool
