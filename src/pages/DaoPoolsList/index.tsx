import * as React from "react"
import { isEmpty, isNil, map } from "lodash"
import { useSelector } from "react-redux"
import { v4 as uuidv4 } from "uuid"
import { useWeb3React } from "@web3-react/core"
import { PulseSpinner } from "react-spinners-kit"

import { Container, Indents, Action, List } from "./styled"

import Header from "components/Header/Layout"
import RouteTabs from "components/RouteTabs"
import { ITab } from "interfaces"
import tutorialImageSrc from "assets/others/create-fund-docs.png"
import TutorialCard from "components/TutorialCard"
import {
  selectGovPoolsByNameSubstring,
  selectPayload,
} from "state/govPools/selectors"
import { Text, To } from "theme"
import GovPoolStatisticCard from "components/cards/GovPoolStatistic"

const DaoPoolsList: React.FC = () => {
  const { account } = useWeb3React()

  const search = React.useState("")
  const { loading } = useSelector(selectPayload)
  const pools = useSelector((s) => selectGovPoolsByNameSubstring(s, search[0]))

  const tabs: ITab[] = [
    {
      title: "TOP DAO",
      source: "/dao/list/top",
    },
    {
      title: "Voting power",
      source: `/dao/list/voting-power`,
    },
  ]

  const PoolsList = React.useMemo(() => {
    if (loading && (isEmpty(pools) || isNil(pools))) {
      return <PulseSpinner />
    }

    if (!loading && isEmpty(pools)) {
      return <Text color="#B1C7FC">No DAO pools</Text>
    }

    return (
      <>
        {map(pools, (pool, index) => (
          <To key={uuidv4()} to={`/dao/${pool.id}`}>
            <Indents key={uuidv4()}>
              <GovPoolStatisticCard
                data={pool}
                account={account}
                index={index}
              />
            </Indents>
          </To>
        ))}
      </>
    )
  }, [pools, loading])

  return (
    <>
      <Header>DAO</Header>
      <Container>
        <Indents top={false}>
          <TutorialCard
            text="Create unique DAO in 5 steps, manage through proposals, get rewards"
            linkText="Read the tutorial"
            imageSrc={tutorialImageSrc}
            href="https://dexe.network/"
          />
        </Indents>
        <List.Container>
          <Indents>
            <List.Header>
              <RouteTabs m="0" tabs={tabs} />
              <Action text="+ Create new" routePath="/create-fund" />
            </List.Header>
          </Indents>
          <List.Scroll center={isNil(pools) || isEmpty(pools)}>
            {PoolsList}
          </List.Scroll>
        </List.Container>
      </Container>
    </>
  )
}

export default DaoPoolsList
