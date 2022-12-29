import React from "react"

import Header from "components/Header/Layout"
import { opacityVariants } from "motion/variants"
import CreateFundContextProvider from "context/fund/CreateFundContext"

import * as S from "./styled"

const CreateFundBasicNew: React.FC = () => {
  return (
    <S.Root>
      <Header>Create standart fund</Header>
      <S.Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        variants={opacityVariants}
      >
        <CreateFundContextProvider>
          <p>some info</p>
        </CreateFundContextProvider>
      </S.Container>
    </S.Root>
  )
}

export default CreateFundBasicNew
