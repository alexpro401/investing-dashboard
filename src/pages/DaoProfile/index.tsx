import React, { useCallback, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { BigNumber } from "@ethersproject/bignumber"

import * as S from "./styled"
import {
  DaoProfileStatisticCard,
  DaoProfileChart,
  DaoProfileBuyTokenCard,
  DaoProfileTokensInTreasuryCard,
} from "./components"
import {
  DaoProfileTabAbout,
  DaoProfileTabBalance,
  DaoProfileTabValidators,
  DaoProfileTabUsedTokens,
} from "./tabs"
import { PageChart } from "./types"

import Header from "components/Header/Layout"

import WithGovPoolAddressValidation from "components/WithGovPoolAddressValidation"
import ChooseDaoProposalAsPerson from "modals/ChooseDaoProposalAsPerson"

import { selectDexeAddress } from "state/contracts/selectors"
import { useSelector } from "react-redux"
import Tabs from "common/Tabs"
import { Center, Flex } from "theme"
import { GuardSpinner } from "react-spinners-kit"

import { useGovPoolContract } from "contracts"
import { isNil } from "lodash"

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
  const { daoAddress } = useParams()
  const dexeAddress = useSelector(selectDexeAddress)
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
              child: load ? (
                <Center>
                  <GuardSpinner size={20} loading />
                </Center>
              ) : (
                <DaoProfileTabAbout />
              ),
            },
            {
              name: "My Balance",
              child: load ? (
                <Center>
                  <GuardSpinner size={20} loading />
                </Center>
              ) : (
                <DaoProfileTabBalance />
              ),
            },
            {
              name: "Validators",
              child: load ? (
                <Center>
                  <GuardSpinner size={20} loading />
                </Center>
              ) : (
                <DaoProfileTabValidators />
              ),
            },
            {
              name: "In treasury/used",
              child: load ? (
                <Center>
                  <GuardSpinner size={20} loading />
                </Center>
              ) : (
                <DaoProfileTabUsedTokens />
              ),
            },
          ]}
        />
      </S.Indents>
    )
  }, [govPoolContract])

  return (
    <>
      <Header>Dao Profile</Header>
      <WithGovPoolAddressValidation daoPoolAddress={daoAddress ?? ""}>
        <S.Container>
          <S.Indents top>
            <DaoProfileStatisticCard
              isValidator={isValidator}
              handleOpenCreateProposalModal={handleOpenCreateProposalModal}
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
