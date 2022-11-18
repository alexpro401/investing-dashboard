import * as S from "./styled"

import { FC, HTMLAttributes, useMemo, useState } from "react"
import Header from "components/Header/Layout"
import { DetailsTab, VotingSettingsTab, VotingHistoryTab } from "./components"
import { AnimatePresence } from "framer-motion"
import { useGovPoolProposal, useGovPoolProposals } from "hooks/dao"
import { useParams } from "react-router-dom"
import { useEffectOnce } from "react-use"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const DaoProposalDetails: FC<Props> = ({}) => {
  const { daoAddress, proposalId } = useParams<{
    daoAddress: string
    proposalId: string
  }>()

  // TEMP

  const { proposalViews, loadProposals, isLoaded, isLoadFailed } =
    useGovPoolProposals(daoAddress!)

  const paginationOffset = +proposalId! - 1
  const paginationPageLimit = 1

  useEffectOnce(() => {
    loadProposals(paginationOffset, paginationPageLimit)
  })

  const govPoolProposal = useGovPoolProposal(
    Number(proposalId),
    daoAddress!,
    proposalViews[0]
  )

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
            {govPoolProposal.name}
          </S.DaoProposalDetailsTitle>
        </S.DaoProposalDetailsTitleWrp>
        <S.DaoProposalDetailsProgressBar />
        <S.DaoProposalDetailsCard>
          {govPoolProposal.description}
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
          {selectedTabNumber === TABS[0].number && (
            <DetailsTab govPoolProposal={govPoolProposal} />
          )}
          {selectedTabNumber === TABS[1].number && <VotingSettingsTab />}
          {selectedTabNumber === TABS[2].number && <VotingHistoryTab />}
        </AnimatePresence>
      </S.DaoProposalDetails>
    </>
  )
}

export default DaoProposalDetails
