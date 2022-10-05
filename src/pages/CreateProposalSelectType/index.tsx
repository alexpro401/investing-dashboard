import React from "react"

import Header from "components/Header/Layout"
import TutorialCard from "components/TutorialCard"

import tutorialImageSrc from "assets/others/create-fund-docs.png"
import * as S from "./styled"

const CreateProposalSelectType: React.FC = () => {
  return (
    <>
      <Header>Create proposal</Header>
      <S.CreateProposalSelectTypePageHolder
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <TutorialCard
          text={"Shape your DAO with your best ideas."}
          imageSrc={tutorialImageSrc}
          href={"https://github.com/"}
        />
        <p style={{ color: "#fff" }}>123123123123</p>
      </S.CreateProposalSelectTypePageHolder>
    </>
  )
}

export default CreateProposalSelectType
