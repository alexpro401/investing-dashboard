import React from "react"

import Header from "components/Header/Layout"
import CreateFundContextProvider from "context/fund/CreateFundContext"
import CreateFundFormNew from "forms/CreateFundFormNew"

import * as S from "./styled"

const CreateFundBasicNew: React.FC = () => {
  return (
    <S.Root>
      <Header>Create standart fund</Header>
      <S.PageHolder>
        <S.PageContent>
          <CreateFundContextProvider>
            <CreateFundFormNew />
          </CreateFundContextProvider>
        </S.PageContent>
      </S.PageHolder>
    </S.Root>
  )
}

export default CreateFundBasicNew
