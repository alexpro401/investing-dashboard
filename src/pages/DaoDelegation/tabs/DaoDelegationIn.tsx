import * as React from "react"
import * as S from "../styled"
import { isEmpty, isNil, map } from "lodash"
import { useWeb3React } from "@web3-react/core"
import { PulseSpinner } from "react-spinners-kit"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

import { Card } from "common"
import theme, { Center, Flex, Text } from "theme"
import GovDelegateeCard from "components/cards/GovDelegatee"
import { GovPoolDelegationHistoryByUserQuery } from "queries"
import useQueryPagination from "hooks/useQueryPagination"
import LoadMore from "components/LoadMore"

const DaoDelegationIn: React.FC<{ govPoolAddress?: string }> = ({
  govPoolAddress,
}) => {
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
    GovPoolDelegationHistoryByUserQuery(false),
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
      <S.Indents top>
        <Card>
          <Flex full ai={"center"} jc={"space-between"}>
            <Text color={theme.textColors.primary}>Total addresses: 90</Text>
            <Text color={theme.textColors.primary}>Total delegate: 90,000</Text>
          </Flex>
          <Flex full dir={"column"} gap={"8"}>
            {map(data, (dh, index) => (
              <GovDelegateeCard data={dh} chainId={chainId} key={index} />
            ))}
            <LoadMore
              isLoading={loading && !!data.length}
              handleMore={fetchMore}
              r={loader}
            />
          </Flex>
        </Card>
      </S.Indents>
    </S.List>
  )
}

export default DaoDelegationIn
