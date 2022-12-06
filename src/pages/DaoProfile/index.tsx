import React, { useCallback, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { BigNumber } from "@ethersproject/bignumber"
import { isNil } from "lodash"
import { useSelector } from "react-redux"
import { useWeb3React } from "@web3-react/core"
import { GuardSpinner } from "react-spinners-kit"

import * as S from "./styled"
import {
  DaoProfileStatisticCard,
  DaoProfileChart,
  DaoProfileBuyTokenCard,
  DaoProfileTokensInTreasuryCard,
} from "./components"
const DaoProfileTabAbout = React.lazy(() => import("./tabs/DaoProfileTabAbout"))
const DaoProfileTabBalance = React.lazy(
  () => import("./tabs/DaoProfileTabBalance")
)
const DaoProfileTabValidators = React.lazy(
  () => import("./tabs/DaoProfileTabValidators")
)
const DaoProfileTabUsedTokens = React.lazy(
  () => import("./tabs/DaoProfileTabUsedTokens")
)
import { PageChart } from "./types"

import Header from "components/Header/Layout"
import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import ChooseDaoProposalAsPerson from "modals/ChooseDaoProposalAsPerson"
import { selectDexeAddress } from "state/contracts/selectors"
import Tabs from "common/Tabs"
import { Flex } from "theme"
import { useGovPoolContract } from "contracts"

import { createClient, useQuery } from "urql"
import { GovPoolQuery } from "queries"
import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"

const govPoolsClient = createClient({
  url: process.env.REACT_APP_DAO_POOLS_API_URL || "",
})

const TabFallback = () => (
  <div style={{ width: "100%", height: "50vh" }}>
    <Flex full ai={"flex-start"} jc={"center"}>
      <GuardSpinner size={20} loading />
    </Flex>
  </div>
)

const FakeTokensData = (dexeAddress) => [
  {
    id: dexeAddress ?? "0x",
    type: "Token",
    amount: "14.2134.213412",
    amountUsd: "14",
    inTreasury: "100",
    inVoting: "21",
  },
  {
    id: dexeAddress ?? "0x",
    type: "NFT",
    amount: "11234.1324",
    amountUsd: "141234.123",
    inTreasury: "23",
    inVoting: "41",
  },
  {
    id: dexeAddress ?? "0x",
    type: "Token",
    amount: "14",
    amountUsd: "14",
    inTreasury: "14",
    inVoting: "20",
  },
  {
    id: dexeAddress ?? "0x",
    type: "NFT",
    amount: "14",
    amountUsd: "14",
    inTreasury: "14",
    inVoting: "20",
  },
  {
    id: dexeAddress ?? "0x",
    type: "NFT",
    amount: "14",
    amountUsd: "14",
    inTreasury: "14",
    inVoting: "20",
  },
  {
    id: dexeAddress ?? "0x",
    type: "Token",
    amount: "14",
    amountUsd: "14",
    inTreasury: "14",
    inVoting: "20",
  },
  {
    id: dexeAddress ?? "0x",
    type: "NFT",
    amount: "14",
    amountUsd: "14",
    inTreasury: "14",
    inVoting: "20",
  },
  {
    id: dexeAddress ?? "0x",
    type: "Token",
    amount: "14",
    amountUsd: "14",
    inTreasury: "14",
    inVoting: "20",
  },
  {
    id: dexeAddress ?? "0x",
    type: "NFT",
    amount: "14",
    amountUsd: "14",
    inTreasury: "14",
    inVoting: "20",
  },
  {
    id: dexeAddress ?? "0x",
    type: "Token",
    amount: "14",
    amountUsd: "14",
    inTreasury: "14",
    inVoting: "20",
  },
  {
    id: dexeAddress ?? "0x",
    type: "Token",
    amount: "14",
    amountUsd: "14",
    inTreasury: "14",
    inVoting: "20",
  },
  {
    id: dexeAddress ?? "0x",
    type: "NFT",
    amount: "14",
    amountUsd: "14",
    inTreasury: "14",
    inVoting: "20",
  },
  {
    id: dexeAddress ?? "0x",
    type: "NFT",
    amount: "14",
    amountUsd: "14",
    inTreasury: "14",
    inVoting: "20",
  },
]

const DaoProfile: React.FC = () => {
  const { account, chainId } = useWeb3React()
  const { daoAddress } = useParams()
  const dexeAddress = useSelector(selectDexeAddress)

  const [govPoolQuery] = useQuery<{ daoPool: IGovPoolQuery }>({
    query: GovPoolQuery,
    variables: useMemo(() => ({ address: daoAddress }), [daoAddress]),
    context: govPoolsClient,
  })

  const govPoolContract = useGovPoolContract(daoAddress)

  const isValidator = true

  const [chart, setChart] = useState<PageChart>(PageChart.tvl)

  const [createProposalModalOpened, setCreateProposalModalOpened] =
    useState<boolean>(false)

  const handleOpenCreateProposalModal = useCallback(() => {
    setCreateProposalModalOpened(true)
  }, [])

  const handleCloseCreateProposalModal = useCallback(() => {
    setCreateProposalModalOpened(false)
  }, [])

  const DaoProfilePageTabs = useMemo(() => {
    const load = isNil(govPoolContract)

    return (
      <S.Indents>
        <Tabs
          tabs={[
            {
              name: "About DAO",
              child: (
                <React.Suspense fallback={<TabFallback />}>
                  <DaoProfileTabAbout />
                </React.Suspense>
              ),
            },
            {
              name: "My Balance",
              child: (
                <React.Suspense fallback={<TabFallback />}>
                  <DaoProfileTabBalance daoAddress={daoAddress} />
                </React.Suspense>
              ),
            },
            {
              name: "Validators",
              child: (
                <React.Suspense fallback={<TabFallback />}>
                  <DaoProfileTabValidators
                    data={[
                      {
                        id: "0x1230413asfadsfljk123041303asjk12",
                        amount: "1230413",
                      },
                      {
                        id: "1x1090423asfadsfljk109042303asjk10",
                        amount: "1090423",
                      },
                      {
                        id: "2x9820456asfadsfljk982045606asjk98",
                        amount: "9820456",
                      },
                      {
                        id: "3x1123412asfadsfljk112341232asjk11",
                        amount: "1123412",
                      },
                    ]}
                    chainId={chainId}
                  />
                </React.Suspense>
              ),
            },
            {
              name: "In treasury/used",
              child: (
                <React.Suspense fallback={<TabFallback />}>
                  <DaoProfileTabUsedTokens
                    data={[
                      {
                        id: "0x1230413asfadsfljk123041303asjk12",
                        amount: "1230413",
                      },
                      {
                        id: "1x1090423asfadsfljk109042303asjk10",
                        amount: "1090423",
                      },
                      {
                        id: "2x9820456asfadsfljk982045606asjk98",
                        amount: "9820456",
                      },
                      {
                        id: "3x1123412asfadsfljk112341232asjk11",
                        amount: "1123412",
                      },
                    ]}
                    chainId={chainId}
                    daoAddress={daoAddress}
                  />
                </React.Suspense>
              ),
            },
          ]}
        />
      </S.Indents>
    )
  }, [govPoolContract, daoAddress])

  return (
    <>
      <Header>Dao Profile</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
        <S.Container>
          <S.Indents top>
            <DaoProfileStatisticCard
              isValidator={isValidator}
              handleOpenCreateProposalModal={handleOpenCreateProposalModal}
              account={account}
              govPoolQuery={govPoolQuery.data?.daoPool ?? ({} as IGovPoolQuery)}
            />
            <S.Indents top side={false}>
              <DaoProfileChart chart={chart} setChart={setChart} />
            </S.Indents>
            <S.Indents top side={false}>
              <DaoProfileBuyTokenCard
                total={BigNumber.from(100)}
                available={BigNumber.from(34)}
              />
            </S.Indents>
            <S.Indents top side={false}>
              <DaoProfileTokensInTreasuryCard
                tokens={FakeTokensData(dexeAddress)}
              />
            </S.Indents>
          </S.Indents>
          <Flex full m="40px 0 16px">
            {DaoProfilePageTabs}
          </Flex>
        </S.Container>
      </WithGovPoolAddressValidation>
      <ChooseDaoProposalAsPerson
        isOpen={createProposalModalOpened}
        daoAddress={daoAddress ?? ""}
        toggle={handleCloseCreateProposalModal}
      />
    </>
  )
}

export default DaoProfile
