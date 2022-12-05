import * as React from "react"
import { Flex, Text } from "theme"
import { DaoProposalCard } from "common"
import { useGovPoolProposals } from "hooks/dao"
import { PulseSpinner } from "react-spinners-kit"
import { ProposalState, proposalStatusToStates } from "types"

const InsuranceProposals = () => {
  const { wrappedProposalViews, isLoaded, isLoadFailed } = useGovPoolProposals(
    String(process.env.REACT_APP_DEXE_DAO_ADDRESS).toLocaleLowerCase()
  )

  const proposalsToShow = React.useMemo(
    () =>
      wrappedProposalViews.filter((el) =>
        proposalStatusToStates.opened.includes(
          String(el.proposalState) as ProposalState
        )
      ),
    [wrappedProposalViews]
  )

  return (
    <>
      {isLoaded ? (
        isLoadFailed ? (
          <Flex full m="8px 0 0">
            <Text fz={13} lh="150%" color="#B1C7FC">
              Oops... Something went wrong
            </Text>
          </Flex>
        ) : proposalsToShow.length ? (
          <div>
            {proposalsToShow.map((wrappedProposalView, idx) => (
              <DaoProposalCard
                key={idx}
                wrappedProposalView={wrappedProposalView}
              />
            ))}
          </div>
        ) : (
          <Flex full m="8px 0 0">
            <Text fz={13} lh="150%" color="#B1C7FC">
              There&apos;s no proposals, yet
            </Text>
          </Flex>
        )
      ) : (
        <Flex full m="8px 0 0" ai={"center"} jc={"center"}>
          <PulseSpinner />
        </Flex>
      )}
    </>
  )
}

export default InsuranceProposals
