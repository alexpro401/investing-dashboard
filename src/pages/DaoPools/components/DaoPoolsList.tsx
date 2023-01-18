import * as React from "react"
import { isEmpty, isNil } from "lodash"
import { PulseSpinner } from "react-spinners-kit"
import { generatePath, useNavigate } from "react-router-dom"

import theme, { Center } from "theme"
import { Indents, List } from "../styled"
import LoadMore from "components/LoadMore"
import { ICON_NAMES, ROUTE_PATHS, ZERO } from "consts"
import { useBreakpoints, useGovPoolsList } from "hooks"
import { DaoPoolCard, Icon, NoDataMessage } from "common"

interface Props {}

const DaoPoolsList: React.FC<Props> = () => {
  const navigate = useNavigate()

  const { pools, votingPowers, descriptions, loading, fetchMore } =
    useGovPoolsList()

  const { isDesktop } = useBreakpoints()

  if (loading && (isNil(pools) || isEmpty(pools))) {
    return (
      <List.Scroll center>
        <Center>
          <PulseSpinner color={theme.statusColors.success} />
        </Center>
      </List.Scroll>
    )
  }

  if (!loading && isEmpty(pools)) {
    return (
      <List.Scroll center>
        <Center>
          <NoDataMessage />
        </Center>
      </List.Scroll>
    )
  }

  return (
    <List.Scroll center={false}>
      {pools.map((pool, index) => (
        <Indents key={pool.id} top={index > 0}>
          <DaoPoolCard
            data={pool}
            totalVotingPower={votingPowers[pool.id] ?? ZERO}
            metadata={descriptions[pool.id] ?? null}
            onClick={() => {
              navigate(
                generatePath(ROUTE_PATHS.daoItem, {
                  daoAddress: pool.id,
                })
              )
            }}
          >
            {isDesktop ? (
              <List.CardIconWrp>
                <Icon name={ICON_NAMES.angleRight} color={"#6781BD"} />
              </List.CardIconWrp>
            ) : (
              <></>
            )}
          </DaoPoolCard>
        </Indents>
      ))}

      <LoadMore isLoading={loading && !!pools.length} handleMore={fetchMore} />
    </List.Scroll>
  )
}

export default DaoPoolsList
