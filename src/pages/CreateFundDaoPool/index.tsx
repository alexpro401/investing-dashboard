import Header from "components/Header/Layout"

import { FC } from "react"
import { Container } from "./styled"

const CreateFundDaoPool: FC = () => {
  return (
    <>
      <Header>Create DAO</Header>
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        DAO
      </Container>
    </>
  )
}

export default CreateFundDaoPool
