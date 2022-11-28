import * as React from "react"
import { v4 as uuidv4 } from "uuid"
import { createClient } from "urql"
import { isEmpty, isNil, map } from "lodash"
import { useWeb3React } from "@web3-react/core"
import { PulseSpinner } from "react-spinners-kit"

import * as S from "../styled"
import { Center, Text } from "theme"
import LoadMore from "components/LoadMore"
import { ZERO_ADDR } from "constants/index"
import { GovProposalsWithRewardsQuery } from "queries"
import useQueryPagination from "hooks/useQueryPagination"
import { IGovPoolVoterInProposalQuery } from "interfaces/thegraphs/gov-pools"

const govPoolsClient = createClient({
  url: process.env.REACT_APP_DAO_POOLS_API_URL || "",
  requestPolicy: "network-only",
})

interface Props {
  daoAddress?: string
}

const DaoClaimTabRewards: React.FC<Props> = ({ daoAddress }) => {
  const { account } = useWeb3React()

  const [{ data, loading }, fetchMore] =
    useQueryPagination<IGovPoolVoterInProposalQuery>({
      query: GovProposalsWithRewardsQuery,
      variables: React.useMemo(
        () => ({
          pool: daoAddress,
          voters: [account],
          executorExclude: ZERO_ADDR,
        }),
        [daoAddress]
      ),
      pause: isNil(daoAddress) || isNil(account),
      context: govPoolsClient,
      formatter: (d) => d.proposals,
    })

  const listRef = React.useRef<any>()

  const ListContent = React.useMemo(() => {
    if (loading && (isNil(data) || isEmpty(data))) {
      return (
        <Center>
          <PulseSpinner />
        </Center>
      )
    }
    if (!loading && isEmpty(data)) {
      return (
        <Center>
          <Text>No active rewards</Text>
        </Center>
      )
    }
    return map(data, (proposal) => <div key={uuidv4()}>{proposal.id}</div>)
  }, [data, loading])

  return (
    <>
      <S.List ref={listRef}>
        {ListContent}
        <LoadMore
          isLoading={loading && !!data.length}
          handleMore={fetchMore}
          r={listRef}
        />
      </S.List>
      <S.BottomActionContainer>
        <S.AppButtonFull text={"Claim All rewards"} />
      </S.BottomActionContainer>
    </>
  )
}

export default DaoClaimTabRewards
