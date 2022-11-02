import Header from "components/Header/Layout"
import { FundContextProvider } from "context/CreateFundContext"
import CreateFundForm from "forms/CreateFundForm"

import { FC } from "react"
import * as S from "./styled"
import { opacityVariants } from "motion/variants"

const CreateFundDaoPool: FC = () => {
  return (
    <>
      <Header>Create Fund Investment</Header>
      <S.Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        variants={opacityVariants}
      >
        <FundContextProvider>
          <CreateFundForm presettedFundType="investment" />
        </FundContextProvider>
      </S.Container>
    </>
  )
}

export default CreateFundDaoPool
