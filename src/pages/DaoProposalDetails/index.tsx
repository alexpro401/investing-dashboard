import * as S from "./styled"

import { FC, HTMLAttributes, useMemo, useState } from "react"
import Header from "components/Header/Layout"
import { DetailsTab, VotingSettingsTab, VotingHistoryTab } from "./components"
import { AnimatePresence } from "framer-motion"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const DaoProposalDetails: FC<Props> = ({}) => {
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
        <AnimatePresence initial={false}>
          {selectedTabNumber === TABS[0].number && <DetailsTab />}
          {selectedTabNumber === TABS[1].number && <VotingSettingsTab />}
          {selectedTabNumber === TABS[2].number && <VotingHistoryTab />}
        </AnimatePresence>
      </S.DaoProposalDetails>
    </>
  )
}

export default DaoProposalDetails
