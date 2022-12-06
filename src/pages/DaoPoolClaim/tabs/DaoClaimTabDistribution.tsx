import * as React from "react"
import * as S from "../styled"
import { Center, Text } from "theme"
import useGovDistributionsWithActiveClaim from "hooks/dao/useGovDistributionsWithActiveClaim"
import { isEmpty, isNil, map } from "lodash"
import { PulseSpinner } from "react-spinners-kit"
import { v4 as uuidv4 } from "uuid"
import LoadMore from "components/LoadMore"

interface Props {
  daoAddress?: string
}

const DaoClaimTabDistribution: React.FC<Props> = ({ daoAddress }) => {
  const [{ data, loading }, fetchMore] =
    useGovDistributionsWithActiveClaim(daoAddress)

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
          <Text>No active distributions</Text>
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
        <S.AppButtonFull text={"Claim All distributed tokens"} />
      </S.BottomActionContainer>
    </>
  )
}

export default DaoClaimTabDistribution
