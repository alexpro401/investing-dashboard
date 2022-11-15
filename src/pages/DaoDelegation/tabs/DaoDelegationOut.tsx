import * as React from "react"
import { v4 as uuidv4 } from "uuid"
import { isEmpty, isNil, map } from "lodash"
import { useWeb3React } from "@web3-react/core"
import { PulseSpinner } from "react-spinners-kit"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

import * as S from "../styled"
import theme, { Center, Text } from "theme"

import LoadMore from "components/LoadMore"
import useQueryPagination from "hooks/useQueryPagination"
import { GovPoolDelegationHistoryByUserQuery } from "queries"
import GovTokenDelegationCard from "components/cards/GovTokenDelegation"
import { IGovPoolDelegationHistoryQuery } from "interfaces/thegraphs/gov-pools"

interface Props {
  govPoolAddress?: string
}

const DaoDelegationOut: React.FC<Props> = ({ govPoolAddress }) => {
  const { chainId, account } = useWeb3React()

  const variables = React.useMemo(
    () => ({
      address: govPoolAddress,
      account,
    }),
    [account, govPoolAddress]
  )
  const pause = React.useMemo(
    () => isNil(account) || isNil(govPoolAddress),
    [account, govPoolAddress]
  )

  const [{ data, loading }, fetchMore] = useQueryPagination(
    GovPoolDelegationHistoryByUserQuery(true),
    variables,
    pause,
    (d) => d.delegationHistories
  )

  const loader = React.useRef<any>()

  React.useEffect(() => {
    if (!loader.current) return
    disableBodyScroll(loader.current)

    return () => clearAllBodyScrollLocks()
  }, [loader, loading])

  if (loading && (isEmpty(data) || isNil(data))) {
    return (
      <S.List>
        <Center>
          <PulseSpinner color={theme.statusColors.success} />
        </Center>
      </S.List>
    )
  }

  if (!loading && isEmpty(data)) {
    return (
      <S.List>
        <Center>
          <Text color={theme.textColors.secondary}>No Delegations</Text>
        </Center>
      </S.List>
    )
  }

  return (
    <S.List ref={loader}>
      {map(data, (dh) => (
        <S.Indents top key={uuidv4()}>
          <GovTokenDelegationCard
            data={dh}
            chainId={chainId}
            alwaysShowMore={data.length === 1 ? true : undefined}
          />
        </S.Indents>
      ))}
      <LoadMore
        isLoading={loading && !!data.length}
        handleMore={fetchMore}
        r={loader}
      />
    </S.List>
  )
}

export default DaoDelegationOut
