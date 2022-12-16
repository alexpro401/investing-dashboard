import Header from "components/Header/Layout"
import CreateFundDaoForm from "forms/CreateFundDaoForm"
import GovPoolFormContextProvider from "context/govPool/GovPoolFormContext"

import { FC } from "react"
import { opacityVariants } from "motion/variants"
import * as S from "./styled"

const CreateFundDaoPool: FC = () => {
  return (
    <S.Root>
      <Header>Create DAO</Header>
      <S.Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        variants={opacityVariants}
      >
        <GovPoolFormContextProvider>
          <CreateFundDaoForm />
        </GovPoolFormContextProvider>
      </S.Container>
    </S.Root>
  )
}

export default CreateFundDaoPool
