import React, { useState, useContext } from "react"
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
import { GovPoolProfileCommonContext } from "context/govPool/GovPoolProfileCommonContext/GovPoolProfileCommonContext"

import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"
import { useBreakpoints } from "hooks"
import { Breadcrumbs } from "common"

import * as S from "./styled"

const DaoProfile: React.FC = () => {
  const { account } = useWeb3React()
  const { daoAddress } = useParams()

  const { govPoolQuery, descriptionObject } = useContext(
    GovPoolProfileCommonContext
  )
  const isValidator = true

  const [chart, setChart] = useState<PageChart>(PageChart.tvl)

  const { isBigTablet } = useBreakpoints()

  return (
    <>
      <Header>{!isBigTablet ? "Dao Profile" : <Breadcrumbs />}</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
        <S.Container>
          {isBigTablet && (
            <S.Indents side>
              <DesktopRouteTabs />
            </S.Indents>
          )}
          {!isBigTablet && (
            <S.Indents top>
              <DaoProfileStatisticCard
                isValidator={isValidator}
                account={account}
                govPoolQuery={{
                  ...((govPoolQuery?.data?.daoPool
                    ? {
                        ...govPoolQuery.data?.daoPool,
                        name: descriptionObject
                          ? descriptionObject.daoName
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
          <S.Indents top side>
            <Routing />
          </S.Indents>
        </S.Container>
      </WithGovPoolAddressValidation>
    </>
  )
}

export default DaoProfile
