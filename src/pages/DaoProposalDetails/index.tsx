import * as S from "./styled"

import { FC, HTMLAttributes, useMemo, useState } from "react"
import Header from "components/Header/Layout"
import ExternalLink from "../../components/ExternalLink"
import { shortenAddress } from "../../utils"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const DaoProposalDetails: FC<Props> = ({ ...rest }) => {
  const TABS = useMemo(
    () => [
      { label: "Proposal details", number: 1 },
      { label: "Voting settings", number: 2 },
      { label: "Voting history", number: 3 },
    ],
    []
  )

  const [selectedTabNumber, setSelectedTabNumber] = useState(TABS[0].number)

  return (
    <>
      <Header>Proposal</Header>
      <S.DaoProposalDetails>
        <S.DaoProposalDetailsTitleWrp>
          <S.DaoProposalDetailsTitle>
            Attracting more members to govern DAO
          </S.DaoProposalDetailsTitle>
        </S.DaoProposalDetailsTitleWrp>
        <S.DaoProposalDetailsProgressBar />
        <S.DaoProposalDetailsCard>
          <p>
            📌 Concise proposal description and reasoning It’s no secret that
            our DAO hit a roadblock in getting proposals accepted, specifically
            getting quorum of votes. This is mainly because the voting period is
            only 5 days.
          </p>
          <p>
            📌 Proposed solution To involve more members in voting, we discussed
            and decided to change the following: Length of voting period from 5
            to 10 days Minimum voting power required for voting from 100 to 50
          </p>
          <p>
            📌 Conclusion Changing these parameters will allow our DAO to
            involve more members in governance and will give them more time to
            vote. readmore
          </p>
        </S.DaoProposalDetailsCard>
        <S.DaoProposalDetailsTabs>
          {TABS.map((el) => (
            <S.DaoProposalDetailsTabsItem
              key={el.number}
              isActive={el.number === selectedTabNumber}
              onClick={() => setSelectedTabNumber(el.number)}
            >
              {el.label}
            </S.DaoProposalDetailsTabsItem>
          ))}
        </S.DaoProposalDetailsTabs>
        <S.DaoProposalDetailsCard>
          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText type="complex">
              <p>Active settings</p>
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText type="success">
              Proposed changes
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>

          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText type="complex">
              <span>Length of voting period</span>
              <p>1D/1H/1M</p>
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText type="success">
              10D/1H/1M
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>

          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText type="complex">
              <span>Min. voting power required for voting </span>
              <p>100</p>
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText type="success">
              50
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </S.DaoProposalDetailsCard>
        <S.DaoProposalDetailsCard>
          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText type="label">
              Contract address
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText type="value">
              <ExternalLink href={""}>
                {shortenAddress("0x987654321234567898765432123456789876543")}
              </ExternalLink>
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>

          <S.DaoProposalCardRowDivider />

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText type="label">
              value
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText type="value">
              0.2 BNB
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </S.DaoProposalDetailsCard>
        <S.DaoProposalDetailsCard>
          <S.DaoProposalDetailsCardTitle>
            Proposal Details
          </S.DaoProposalDetailsCardTitle>

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText type="label">
              created
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText type="value">
              <ExternalLink href={""}>
                {shortenAddress("0x987654321234567898765432123456789876543")}
              </ExternalLink>
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText type="label">
              voting status
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText type="value">
              <S.DaoProposalDetailsRowText type="value">
                10.000/
              </S.DaoProposalDetailsRowText>
              <S.DaoProposalDetailsRowText type="label">
                80.000
              </S.DaoProposalDetailsRowText>
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText type="label">
              Proposal type
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText type="value">
              Changing voting options
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText type="label">
              Addresses voted
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText type="value">
              1
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText type="label">
              My votes
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText type="value">
              200
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>

          <S.DaoProposalDetailsRow>
            <S.DaoProposalDetailsRowText type="label">
              Voted via delegate
            </S.DaoProposalDetailsRowText>
            <S.DaoProposalDetailsRowText type="value">
              0
            </S.DaoProposalDetailsRowText>
          </S.DaoProposalDetailsRow>
        </S.DaoProposalDetailsCard>
      </S.DaoProposalDetails>
    </>
  )
}

export default DaoProposalDetails
