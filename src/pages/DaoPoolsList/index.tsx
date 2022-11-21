import * as React from "react"
import { isEmpty } from "lodash"
import { useSelector } from "react-redux"
import { useWeb3React } from "@web3-react/core"
import AutoSizer from "react-virtualized-auto-sizer"
import { FixedSizeList, ListChildComponentProps } from "react-window"

import theme, { Text, Center } from "theme"
import { Container, Indents, Action, List } from "./styled"

import Header from "components/Header/Layout"
import RouteTabs from "components/RouteTabs"
import { ITab } from "interfaces"
import tutorialImageSrc from "assets/others/create-fund-docs.png"
import TutorialCard from "components/TutorialCard"
import { selectGovPoolsByNameSubstring } from "state/govPools/selectors"
import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"
import PoolRow from "./components/PoolRow"

const DaoPoolsList: React.FC = () => {
  const { account } = useWeb3React()

  const search = React.useState("")
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
          <div>
            {!isEmpty(pools) ? (
              <AutoSizer>
                {({ height, width }) => (
                  <FixedSizeList
                    itemData={pools}
                    itemCount={pools.length}
                    itemSize={144}
                    height={height}
                    width={width}
                  >
                    {(payload: ListChildComponentProps<IGovPoolQuery[]>) => (
                      <PoolRow payload={payload} account={account} />
                    )}
                  </FixedSizeList>
                )}
              </AutoSizer>
            ) : (
              <Center>
                <Text color={theme.textColors.secondary}>No DAO pools yet</Text>
              </Center>
            )}
          </div>
        </List.Container>
      </Container>
    </>
  )
}

export default DaoPoolsList
