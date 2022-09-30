import Header from "components/Header/Layout"
import CreateFundContext from "context/CreateFundContext"
import CreateFundForm from "forms/CreateFundForm"

import { FC } from "react"
import * as S from "./styled"
import { opacityVariants } from "motion/variants"

const CreateFundDaoPool: FC = () => {
  return (
    <>
      <Header>Create Fund basic</Header>
      <S.Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        variants={opacityVariants}
      >
        <CreateFundContext>
          <CreateFundForm presettedFundType="basic" />
        </CreateFundContext>
      </S.Container>
    </>
  )
}

export default CreateFundDaoPool
