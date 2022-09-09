import Header from "components/Header/Layout"
import Button from "components/Button"
import Icon from "components/Icon"
import FundTypeCard from "./FundTypeCard"

import { FC, useState } from "react"
import {
  Container,
  FundTypeCards,
  FundTypeCardsTitle,
  CreateFundDocsBlock,
  CreateFundDocsBlockTitle,
  CreateFundDocsBlockLink,
  CreateFundDocsImg,
  HighlightDecor,
  CreateFundDocsBlockCloseBtn,
} from "./styled"
import { Flex } from "theme"
import { useNavigate } from "react-router-dom"
import CreateFundDocsImage from "assets/others/create-fund-docs.png"

enum FUND_TYPES {
  basic = "basic",
  investment = "investment",
  daoPool = "daoPool",
}

const CreateFund: FC = () => {
  const [fundType, setFundType] = useState(FUND_TYPES.basic)
  const [isShowDocs, setIsShowDocs] = useState(true)

  const navigate = useNavigate()

  const proceedToCreate = () => {
    const targetRoute =
      fundType === FUND_TYPES.basic
        ? "/create-fund/basic"
        : fundType === FUND_TYPES.investment
        ? "/create-fund/investment"
        : "/create-fund/dao"

    navigate(targetRoute)
  }

  return (
    <>
      <Header>Create Fund</Header>
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isShowDocs && (
          <CreateFundDocsBlock>
            <HighlightDecor />
            <CreateFundDocsBlockTitle>
              See the documentation of various pools and key details.
            </CreateFundDocsBlockTitle>
            <CreateFundDocsBlockLink>
              Read the documentation
            </CreateFundDocsBlockLink>
            <CreateFundDocsImg src={CreateFundDocsImage} />
            <CreateFundDocsBlockCloseBtn onClick={() => setIsShowDocs(false)}>
              <Icon />
            </CreateFundDocsBlockCloseBtn>
          </CreateFundDocsBlock>
        )}
        <FundTypeCards>
          <FundTypeCardsTitle>Create your own fund</FundTypeCardsTitle>
          <FundTypeCard
            label="Standard fund"
            description="Trade crypto from the Dexe DAO white list + any other crypto via a Risk Proposal"
            name={FUND_TYPES.basic}
            selected={fundType}
            handleSelect={() => setFundType(FUND_TYPES.basic)}
          />
          <FundTypeCard
            label="Investment fund"
            description="Investment in NFTs, Real Estate, Startups, and any other assets you want."
            name={FUND_TYPES.investment}
            selected={fundType}
            handleSelect={() => setFundType(FUND_TYPES.investment)}
          />
        </FundTypeCards>
        <FundTypeCards>
          <FundTypeCardsTitle>Create and govern your DAO</FundTypeCardsTitle>
          <FundTypeCard
            label="DAO pool"
            description="One-stop platform to create and govern your DAO effectively and securely."
            name={FUND_TYPES.daoPool}
            selected={fundType}
            handleSelect={() => setFundType(FUND_TYPES.daoPool)}
            fundFeatures={[
              "Interact with any DeFi protocol autonomously and automatically",
              "Manage DAOs via tokens, NFTs, or both",
              "Easily reward active DAO members",
              "Modify every DAO governance setting via proposals",
              "Implement different quorum settings for each proposal",
            ]}
          />
        </FundTypeCards>
        <Flex full p="0 16px 42px" m="auto 0 0 0">
          <Button full size="large" onClick={proceedToCreate}>
            Create fund
          </Button>
        </Flex>
      </Container>
    </>
  )
}

export default CreateFund
