import Header from "components/Header/Layout"
import { AppButton } from "common"
import { Collapse, Icon, SelectableCard } from "common"

import { FC, useState } from "react"
import * as S from "./styled"
import { Flex } from "theme"
import { useNavigate } from "react-router-dom"
import { ICON_NAMES } from "constants/icon-names"

import CreateFundDocsImage from "assets/others/create-fund-docs.png"
import RadioButton from "components/RadioButton"

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
      <S.Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isShowDocs && (
          <S.CreateFundDocsBlock>
            <S.HighlightDecor />
            <S.CreateFundDocsBlockTitle>
              See the documentation of various pools and key details.
            </S.CreateFundDocsBlockTitle>
            <S.CreateFundDocsBlockLink>
              Read the documentation
            </S.CreateFundDocsBlockLink>
            <S.CreateFundDocsImg src={CreateFundDocsImage} />
            <S.CreateFundDocsBlockCloseBtn onClick={() => setIsShowDocs(false)}>
              <Icon name={ICON_NAMES.close} />
            </S.CreateFundDocsBlockCloseBtn>
          </S.CreateFundDocsBlock>
        )}
        <S.FundTypeCards>
          <S.FundTypeCardsTitle>Create your own fund</S.FundTypeCardsTitle>
          <SelectableCard
            value={fundType}
            setValue={setFundType}
            valueToSet={FUND_TYPES.basic}
            nodeLeft={
              <RadioButton
                selected={fundType}
                value={FUND_TYPES.basic}
                onChange={() => {}}
              />
            }
            title="Standard fund"
            description={
              <p>
                Trade crypto from the Dexe DAO white list + any other crypto via
                a Risk Proposal
              </p>
            }
          />
          <SelectableCard
            value={fundType}
            setValue={setFundType}
            valueToSet={FUND_TYPES.investment}
            nodeLeft={
              <RadioButton
                selected={fundType}
                value={FUND_TYPES.investment}
                onChange={() => {}}
              />
            }
            title="Investment fund"
            description={
              <p>
                Investment in NFTs, Real Estate, Startups, and any other assets
                you want.
              </p>
            }
          />
        </S.FundTypeCards>
        <S.FundTypeCards>
          <S.FundTypeCardsTitle>
            Create and govern your DAO
          </S.FundTypeCardsTitle>

          <SelectableCard
            value={fundType}
            setValue={setFundType}
            valueToSet={FUND_TYPES.daoPool}
            nodeLeft={
              <RadioButton
                selected={fundType}
                value={FUND_TYPES.daoPool}
                onChange={() => {}}
              />
            }
            title="DAO pool"
            description={
              <p>
                One-stop platform to create and govern your DAO effectively and
                securely.
              </p>
            }
          >
            <Collapse isOpen={fundType === FUND_TYPES.daoPool}>
              <S.CreateFundDaoFeatures>
                {[
                  "Interact with any DeFi protocol autonomously and automatically",
                  "Manage DAOs via tokens, NFTs, or both",
                  "Easily reward active DAO members",
                  "Modify every DAO governance setting via proposals",
                  "Implement different quorum settings for each proposal",
                ].map((el, idx) => (
                  <S.CreateFundDaoFeaturesItem key={idx}>
                    <S.CreateFundDaoFeaturesItemIcon
                      name={ICON_NAMES.greenCheck}
                    />
                    {el}
                  </S.CreateFundDaoFeaturesItem>
                ))}
              </S.CreateFundDaoFeatures>
            </Collapse>
          </SelectableCard>
        </S.FundTypeCards>
        <Flex full p="12px 16px 42px" m="auto 0 0 0">
          <AppButton
            full
            size="large"
            color="primary"
            onClick={proceedToCreate}
            text="Create fund"
          />
        </Flex>
      </S.Container>
    </>
  )
}

export default CreateFund
