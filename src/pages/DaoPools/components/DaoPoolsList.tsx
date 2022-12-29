import * as React from "react"
import { isEmpty, isNil } from "lodash"

import { Indents, List } from "../styled"
import theme, { Center, To } from "theme"
import { DaoPoolCard, NoDataMessage } from "common"
import LoadMore from "components/LoadMore"
import { ROUTE_PATHS } from "consts"
import { PulseSpinner } from "react-spinners-kit"
import { useWeb3React } from "@web3-react/core"
import { generatePath } from "react-router-dom"
import { useWindowSize } from "react-use"
import { useMemo } from "react"
import { useGovPoolsList } from "hooks"

interface Props {}

const DaoPoolsList: React.FC<Props> = () => {
  const { account } = useWeb3React()

  const { data, loading, fetchMore } = useGovPoolsList()

  const listRef = React.useRef<any>()

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
          <NoDataMessage />
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
