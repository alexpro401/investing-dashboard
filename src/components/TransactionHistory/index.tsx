import { Dispatch, SetStateAction, useCallback, useMemo, useRef } from "react"
import { createClient, Provider as GraphProvider } from "urql"
import { PulseSpinner } from "react-spinners-kit"

import useTransactionHistoryUI from "./useTransactionHistoryUI"

import { useActiveWeb3React } from "hooks"
import { UserTransactionsQuery } from "queries"
import useQueryPagination from "hooks/useQueryPagination"
import { TransactionType } from "state/transactions/types"

import Invest from "assets/icons/Invest"
import Withdraw from "assets/icons/Withdraw"
import Swap from "assets/icons/Swap"
import Expand from "assets/icons/Expand"
import Shrink from "assets/icons/Shrink"

import {
  Container,
  Heading,
  Content,
  Header,
  HeaderButton,
  List,
  ListPlaceholder,
} from "./styled"

import Card from "./Card"
import LoadMore from "components/LoadMore"

const poolsClient = createClient({
  url: process.env.REACT_APP_INTERACTIONS_API_URL || "",
  requestPolicy: "network-only",
})

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const TransactionHistory: React.FC<IProps> = ({ open, setOpen }) => {
  const { chainId, account } = useActiveWeb3React()

  const scrollRef = useRef<any>(null)
  const titleRef = useRef<any>(null)

  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev)
  }, [setOpen])

  const [{ filter, scrollH, variants }, { setFilter }] =
    useTransactionHistoryUI(scrollRef, titleRef, open)

  const variables = useMemo<{
    address: string | null | undefined
    transactionTypes: TransactionType[]
  }>(
    () => ({
      address: account,
      transactionTypes: [filter],
    }),
    [account, filter]
  )

  const [{ data, error, loading }, fetchMore] = useQueryPagination(
    UserTransactionsQuery,
    variables,
    (d) => d.transactions
  )

  return (
    <Container>
      <Heading
        animate={{
          opacity: open ? 0 : 1,
          transition: { duration: open ? 0.1 : 0.4 },
        }}
        ref={titleRef}
      >
        Transactions History
      </Heading>
      <Content
        animate={open ? "visible" : "hidden"}
        initial="hidden"
        transition={{ duration: 0.2 }}
        variants={variants}
      >
        <Header>
          <HeaderButton
            onClick={() => setFilter(TransactionType.INVEST)}
            focused={filter === TransactionType.INVEST}
          >
            Investing <Invest active={filter === TransactionType.INVEST} />
          </HeaderButton>
          <HeaderButton
            onClick={() => setFilter(TransactionType.SWAP)}
            focused={filter === TransactionType.SWAP}
          >
            Swap <Swap active={filter === TransactionType.SWAP} />
          </HeaderButton>
          <HeaderButton
            onClick={() => setFilter(TransactionType.DIVEST)}
            focused={filter === TransactionType.DIVEST}
          >
            Withdraw <Withdraw active={filter === TransactionType.DIVEST} />
          </HeaderButton>
          <HeaderButton onClick={toggleOpen}>
            {open ? <Shrink /> : <Expand />}
          </HeaderButton>
        </Header>
        <List
          ref={scrollRef}
          style={{
            height: scrollH,
          }}
        >
          {data.length &&
            data.map((tx) => (
              <Card key={tx.id} payload={tx} chainId={chainId} />
            ))}

          {(!data || (data.length === 0 && loading)) && (
            <ListPlaceholder>
              <PulseSpinner />
            </ListPlaceholder>
          )}

          {(!data || (!data.length && !loading)) && (
            <ListPlaceholder>No transactions</ListPlaceholder>
          )}
          <LoadMore
            isLoading={loading && !!data.length}
            handleMore={fetchMore}
            r={scrollRef}
          />
        </List>
      </Content>
    </Container>
  )
}

const TransactionHistoryWithProvider = (props) => {
  return (
    <GraphProvider value={poolsClient}>
      <TransactionHistory {...props} />
    </GraphProvider>
  )
}

export default TransactionHistoryWithProvider
