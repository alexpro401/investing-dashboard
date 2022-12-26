import * as React from "react"
import { isEmpty, isNil } from "lodash"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

import { Indents, List } from "../styled"
import theme, { Center, To, Text } from "theme"
import { DaoPoolCard } from "common"
import LoadMore from "components/LoadMore"
import useQueryPagination from "hooks/useQueryPagination"
import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"
import { GovPoolsQuery } from "queries"
import { ROUTE_PATHS, ZERO_ADDR } from "constants/index"
import { createClient } from "urql"
import { PulseSpinner } from "react-spinners-kit"
import { useWeb3React } from "@web3-react/core"
import { generatePath } from "react-router-dom"
import { useWindowSize } from "react-use"
import { useMemo } from "react"

const govPoolsClient = createClient({
  url: process.env.REACT_APP_DAO_POOLS_API_URL || "",
  requestPolicy: "network-only",
})

interface Props {}

const DaoPoolsList: React.FC<Props> = () => {
  const { account } = useWeb3React()
  const [{ data, loading }, fetchMore] = useQueryPagination<IGovPoolQuery>({
    query: GovPoolsQuery,
    variables: React.useMemo(() => ({ excludeIds: [ZERO_ADDR] }), []),
    context: govPoolsClient,
    formatter: (d) => d.daoPools,
  })

  const listRef = React.useRef<any>()

  React.useEffect(() => {
    if (!listRef.current) return
    disableBodyScroll(listRef.current)

    return () => clearAllBodyScrollLocks()
  }, [listRef, loading])

  const { width: windowWidth } = useWindowSize()
  const isMobile = useMemo(() => windowWidth < 1194, [windowWidth])

  if (loading && (isNil(data) || isEmpty(data))) {
    return (
      <List.Scroll center>
        <Center>
          <PulseSpinner color={theme.statusColors.success} />
        </Center>
      </List.Scroll>
    )
  }

  if (!loading && isEmpty(data)) {
    return (
      <List.Scroll center>
        <Center>
          <Text color={theme.textColors.secondary}>No Dao pools</Text>
        </Center>
      </List.Scroll>
    )
  }

  return (
    <List.Scroll ref={listRef} center={false}>
      {data.map((pool, index) => (
        <Indents key={pool.id} top={index > 0}>
          <To to={generatePath(ROUTE_PATHS.daoItem, { daoAddress: pool.id })}>
            <DaoPoolCard data={pool} account={account} isMobile={isMobile} />
          </To>
        </Indents>
      ))}

      <LoadMore
        isLoading={loading && !!data.length}
        handleMore={fetchMore}
        r={listRef}
      />
    </List.Scroll>
  )
}

export default DaoPoolsList
