import * as S from "./styled"

import * as React from "react"
import { FC, HTMLAttributes, useMemo, useState } from "react"
import Header from "components/Header/Layout"
import { DetailsTab, VotingSettingsTab, VotingHistoryTab } from "./components"
import { AnimatePresence } from "framer-motion"
import { useGovPoolProposal, useGovPoolProposals } from "hooks/dao"
import { useParams } from "react-router-dom"
import { ErrorText } from "components/AddressChips/styled"
import { Icon } from "common"
import { ICON_NAMES } from "constants/icon-names"
import Skeleton from "components/Skeleton"
import { Flex } from "theme"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const DaoProposalDetails: FC<Props> = ({}) => {
  const { daoAddress, proposalId } = useParams<{
    daoAddress: string
    proposalId: string
  }>()

  // TEMP

  const { wrappedProposalViews, isLoaded, isLoadFailed } = useGovPoolProposals(
    daoAddress,
    proposalId ? +proposalId - 1 : 1,
    1
  )

  const govPoolProposal = useGovPoolProposal(
    wrappedProposalViews[0],
    daoAddress
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
        {isLoaded ? (
          isLoadFailed ? (
            <ErrorText>
              <Flex dir={"column"} gap={"24px"} full>
                <Icon name={ICON_NAMES.exclamationCircle} />
                Oops... Something went wrong
              </Flex>
            </ErrorText>
          ) : (
            <>
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
                {selectedTabNumber === TABS[1].number && (
                  <VotingSettingsTab govPoolProposal={govPoolProposal} />
                )}
                {selectedTabNumber === TABS[2].number && (
                  <VotingHistoryTab govPoolProposal={govPoolProposal} />
                )}
              </AnimatePresence>
              <S.DaoProposalVotingTerminal
                proposalId={proposalId}
                daoPoolAddress={daoAddress}
              />
            </>
          )
        ) : (
          <>
            <Skeleton variant={"text"} w={"calc(100%)"} h={"40%"} />
            <Flex gap={"24px"} full>
              <Skeleton variant={"rect"} w={"30%"} h={"19px"} />
              <Skeleton variant={"rect"} w={"30%"} h={"19px"} />
              <Skeleton variant={"rect"} w={"30%"} h={"19px"} />
            </Flex>
            <Skeleton variant={"text"} w={"calc(100%)"} h={"15%"} />
            <Skeleton variant={"text"} w={"calc(100%)"} h={"15%"} />
            <Skeleton variant={"text"} w={"calc(100%)"} h={"15%"} />
          </>
        )}
      </S.DaoProposalDetails>
    </>
  )
}

export default DaoProposalDetails
