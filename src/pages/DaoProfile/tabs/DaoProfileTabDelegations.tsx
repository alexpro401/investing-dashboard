import React, {
  useMemo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { createClient } from "urql"
import { BigNumber } from "@ethersproject/bignumber"

import theme, { Flex, Text } from "theme"
import { Card, Icon } from "common"
import {
  AppLink,
  FlexLink,
  Image,
  Indents,
  TextLabel,
  TextValue,
  DelegationTabs,
  DelegationTab,
} from "../styled"
import { DaoProfileValueWithActionCard } from "../components"

import Table from "components/Table"
import { AppButton } from "common"
import TabFallback from "./TabFallback"
import PaginationTable from "components/PaginationTable"
import usersImageUrl from "assets/images/users.svg"

import { shortenAddress, formatTokenNumber } from "utils"
import { ICON_NAMES } from "constants/icon-names"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { GovPoolProfileCommonContext } from "context/govPool/GovPoolProfileCommonContext/GovPoolProfileCommonContext"
import { GovPoolProfileTabsContext } from "context/govPool/GovPoolProfileTabsContext/GovPoolProfileTabsContext"
import { DaoPoolProfileTopTokenDelegateeQuery } from "queries/gov-pools"

interface ITokenDelegatee {
  id: string
  receivedDelegation: string
}

interface Props {
  data: any[]
  chainId?: number
  daoAddress?: string
}

type IDelegationLeaderboardTab = "token" | "nft"

const daoGraphClient = createClient({
  url: process.env.REACT_APP_DAO_POOLS_API_URL || "",
  requestPolicy: "network-only",
})

const DaoProfileTabDelegations: React.FC<Props> = ({
  data,
  chainId,
  daoAddress,
}) => {
  const navigate = useNavigate()
  const { haveNft, haveToken } = useContext(GovPoolProfileCommonContext)
  const {
    delegationsLoading,
    totalDelegatedNftVotingPower,
    totalDelegatedTokensVotingPower,
    totalNftDelegatee,
    totalTokensDelegatee,
    topTokenDelegatee,
    setTopTokenDelegatee,
  } = useContext(GovPoolProfileTabsContext)

  const [delegationTabs, setDelegationTabs] = useState<
    IDelegationLeaderboardTab[]
  >(["token"])
  const [selectedDelegationTab, setSelectedDelegationTab] =
    useState<IDelegationLeaderboardTab>("token")

  useEffect(() => {
    if (!delegationsLoading) {
      const newDelegationTabs: IDelegationLeaderboardTab[] = []
      if (haveToken) {
        newDelegationTabs.push("token")
      }
      if (haveNft) {
        newDelegationTabs.push("nft")
      }
      setDelegationTabs(newDelegationTabs)

      const newSelectedDelegationTab = haveToken ? "token" : "nft"
      setSelectedDelegationTab(newSelectedDelegationTab)
    }
  }, [delegationsLoading, haveNft, haveToken])

  const TableHead = useMemo(() => {
    if (
      delegationsLoading ||
      !totalDelegatedNftVotingPower ||
      !totalDelegatedTokensVotingPower
    )
      return null

    return (
      <Flex full ai="center" jc="space-between">
        <TextValue fw={600} color={theme.statusColors.success}>
          TOP delegators
        </TextValue>
        <TextValue fw={600}>
          Total delegated:{" "}
          {selectedDelegationTab === "token"
            ? formatTokenNumber(totalDelegatedTokensVotingPower)
            : formatTokenNumber(totalDelegatedNftVotingPower)}
        </TextValue>
      </Flex>
    )
  }, [
    selectedDelegationTab,
    delegationsLoading,
    totalDelegatedNftVotingPower,
    totalDelegatedTokensVotingPower,
  ])

  const TableNoDataPlaceholder = useMemo(
    () => (
      <Flex full dir="column" ai="center" jc="center">
        <Image src={usersImageUrl} alt="No data" />
        <TextValue align="center" lh="19.5px" fw={500}>
          рандомний текст, в цьому дао немає делегаторів, станьте першим! XD
        </TextValue>
      </Flex>
    ),
    []
  )

  const getTokenDelegateeTableRow = useCallback(
    ({ id, receivedDelegation }: ITokenDelegatee) => (
      <FlexLink
        full
        as={"a"}
        key={uuidv4()}
        href={getExplorerLink(
          chainId ?? 0,
          id.substring(0, 42),
          ExplorerDataType.ADDRESS
        )}
      >
        <Flex full ai="center" jc="space-between">
          <TextValue color={theme.textColors.secondary} block fw={500}>
            <Flex ai="center" jc="flex-start" gap="4">
              {shortenAddress(id.substring(0, 42), 4)}
              <Icon name={ICON_NAMES.externalLink} />
            </Flex>
          </TextValue>
          <TextValue fw={500}>
            {formatTokenNumber(BigNumber.from(receivedDelegation))}
          </TextValue>
          <AppLink color="default" size="no-paddings" text="Delegate" />
        </Flex>
      </FlexLink>
    ),
    [chainId]
  )

  if (delegationsLoading) {
    return <TabFallback />
  }

  return (
    <>
      <DaoProfileValueWithActionCard
        value={
          <>
            <Text color={theme.textColors.primary} fz={16} fw={600}>
              1,000
            </Text>
            <Text color={theme.textColors.secondary} fz={16} fw={600}>
              {" "}
              Votes
            </Text>
          </>
        }
        info={<TextLabel>Delegated by me</TextLabel>}
        onClick={() => navigate(`/dao/${daoAddress ?? ""}/delegation/out`)}
        actionText="Manage"
      />
      <Indents top side={false}>
        <DaoProfileValueWithActionCard
          value={
            <>
              <Text color={theme.textColors.primary} fz={16} fw={600}>
                1,000,200
              </Text>
              <Text color={theme.textColors.secondary} fz={16} fw={600}>
                {" "}
                Votes
              </Text>
            </>
          }
          info={<TextLabel>Delegated to me</TextLabel>}
          onClick={() => navigate(`/dao/${daoAddress ?? ""}/delegation/in`)}
          actionText="Details"
        />
      </Indents>
      <Indents top side={false}>
        <Card>
          <DelegationTabs>
            {delegationTabs.map((el, index) => (
              <DelegationTab
                key={index}
                onClick={() => setSelectedDelegationTab(el)}
                animate={selectedDelegationTab === el ? "visible" : "hidden"}
                full={delegationTabs.length === 1}
              >
                {el === "token" ? "Token" : "NFT"}
              </DelegationTab>
            ))}
          </DelegationTabs>
          {selectedDelegationTab === "token" && totalTokensDelegatee && (
            <>
              {totalTokensDelegatee === 0 && TableNoDataPlaceholder}
              {totalTokensDelegatee !== 0 && (
                <PaginationTable<ITokenDelegatee>
                  total={totalTokensDelegatee}
                  limit={1}
                  data={topTokenDelegatee}
                  setData={setTopTokenDelegatee}
                  row={getTokenDelegateeTableRow}
                  nodeHead={TableHead}
                  query={DaoPoolProfileTopTokenDelegateeQuery}
                  context={daoGraphClient}
                  variables={{ pool: daoAddress }}
                  formatter={(d) => d.voterInPools}
                />
              )}
            </>
          )}
          {selectedDelegationTab === "nft" && (
            // <Table
            //   data={data}
            //   row={getTableRow}
            //   nodeHead={TableHead}
            //   placeholder={TableNoDataPlaceholder}
            // />
            <></>
          )}
        </Card>
      </Indents>
      <Indents top side={false}>
        <AppButton
          full
          size="medium"
          color="primary"
          onClick={() => navigate(`/dao/${daoAddress}/delegate/0x...`)}
          text="Delegate to address"
        />
      </Indents>
    </>
  )
}

export default DaoProfileTabDelegations
