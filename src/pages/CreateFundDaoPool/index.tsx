import Header from "components/Header/Layout"
import CreateFundDaoForm from "forms/CreateFundDaoForm"

import { FC } from "react"
import * as S from "./styled"

const CreateFundDaoPool: FC = () => {
  return (
    <>
      <Header>Create DAO</Header>
      <S.Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <CreateFundDaoForm />
      </S.Container>
    </>
  )
}

export default CreateFundDaoPool
