import Header from "components/Header/Layout"
import { DetailsTab, VotingSettingsTab, VotingHistoryTab } from "./components"
import { AnimatePresence } from "framer-motion"
import { ErrorText } from "components/AddressChips/styled"
import Skeleton from "components/Skeleton"
import ProposalCountDown from "./components/ProposalCountDown"
import { Flex } from "theme"

import * as S from "./styled"

import * as React from "react"
import { FC, HTMLAttributes, useMemo, useState } from "react"
import { useGovPoolProposal, useGovPoolProposals, useBreakpoints } from "hooks"
import { useParams } from "react-router-dom"
import { Icon } from "common"
import { ICON_NAMES } from "consts/icon-names"
import { ValidatorsVote } from "pages/ValidatorsVote"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const DaoProposalDetails: FC<Props> = ({}) => {
  const { daoAddress, proposalId } = useParams<{
    daoAddress: string
    proposalId: string
  }>()

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

  const { isMobile } = useBreakpoints()

  return (
    <>
      <Header>{isMobile ? "Proposal" : ""}</Header>
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
            <S.PageContainer>
              <S.DaoProposalDetailsTitleWrp>
                <S.DaoProposalDetailsTitle>
                  {govPoolProposal.name}
                </S.DaoProposalDetailsTitle>
                {!isMobile ? (
                  <ProposalCountDown
                    date={govPoolProposal.voteEnd.toNumber()}
                  />
                ) : (
                  <></>
                )}
              </S.DaoProposalDetailsTitleWrp>
              <S.DaoProposalDetailsProgressBar />
              <S.ProposalInfoWrp govPoolProposal={govPoolProposal} />
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
              <S.ContentWrapper>
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
              </S.ContentWrapper>
              <S.VotingContainer>
                {govPoolProposal.isSecondStepProgressStarted ? (
                  <>
                    <ValidatorsVote
                      daoPoolAddress={daoAddress}
                      proposalId={String(
                        govPoolProposal.wrappedProposalView.proposalId
                      )}
                      isInternal={false}
                    />
                  </>
                ) : (
                  <>
                    <S.DaoProposalVotingTerminal
                      proposalId={proposalId}
                      daoPoolAddress={daoAddress}
                    />
                  </>
                )}
              </S.VotingContainer>
            </S.PageContainer>
          )
        ) : (
          <>
            <Skeleton variant={"text"} w={"calc(100%)"} h={"40%"} />
            <Flex gap={"24"} full>
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
