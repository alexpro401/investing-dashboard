import React, { useMemo, useState, useContext } from "react"
import { useParams } from "react-router-dom"
import { useWeb3React } from "@web3-react/core"

import {
  DaoProfileStatisticCard,
  DaoProfileChart,
  DaoProfileTokensInTreasuryCard,
  DesktopRouteTabs,
} from "./components"
import { Routing } from "./tabs"
import { PageChart } from "./types"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import { GovPoolProfileTabsContext } from "context/govPool/GovPoolProfileTabsContext/GovPoolProfileTabsContext"

import { useQuery } from "urql"
import { GovPoolQuery } from "queries"
import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"
import { useBreakpoints } from "hooks"
import { Breadcrumbs } from "common"
import { graphClientDaoPools } from "utils/graphClient"

import * as S from "./styled"

const DaoProfile: React.FC = () => {
  const { account } = useWeb3React()
  const { daoAddress } = useParams()

  const { daoDescription } = useContext(GovPoolProfileTabsContext)

  const [govPoolQuery] = useQuery<{ daoPool: IGovPoolQuery }>({
    query: GovPoolQuery,
    variables: useMemo(() => ({ address: daoAddress }), [daoAddress]),
    context: graphClientDaoPools,
  })

  const isValidator = true

  const [chart, setChart] = useState<PageChart>(PageChart.tvl)

  const { isMobile } = useBreakpoints()

  return (
    <>
      <Header>{isMobile ? "Dao Profile" : <Breadcrumbs />}</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
        <S.Container>
          {!isMobile && <DesktopRouteTabs />}
          {isMobile && (
            <S.Indents top>
              <DaoProfileStatisticCard
                isValidator={isValidator}
                account={account}
                govPoolQuery={{
                  ...((govPoolQuery.data?.daoPool
                    ? {
                        ...govPoolQuery.data?.daoPool,
                        name: daoDescription
                          ? daoDescription.daoName
                          : govPoolQuery.data.daoPool.name,
                      }
                    : {}) as IGovPoolQuery),
                }}
              />
              <S.Indents top side={false}>
                <DaoProfileChart chart={chart} setChart={setChart} />
              </S.Indents>
              <S.Indents top side={false}>
                <DaoProfileTokensInTreasuryCard />
              </S.Indents>
            </S.Indents>
          )}
          <Routing
            creationTime={
              govPoolQuery.data?.daoPool?.creationTime
                ? Number(govPoolQuery.data.daoPool.creationTime)
                : undefined
            }
          />
        </S.Container>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default DaoProfile
