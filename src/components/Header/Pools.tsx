import { useMemo, useState, ReactNode } from "react"
import { useWeb3React } from "@web3-react/core"
import { useNavigate } from "react-router-dom"
import { CircleSpinner } from "react-spinners-kit"
import { useSelector } from "react-redux"
import { createClient, Provider as GraphProvider } from "urql"

import Icon from "components/Icon"
import OwnedPoolsList from "modals/OwnedPoolsList"

import { selectPayload } from "state/pools/selectors"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { selectInvolvedPoolsData } from "state/user/selectors"

import AddFund from "assets/icons/AddFund"

import { PortraitsPlus, Funds, FundWrapper } from "./styled"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
  requestPolicy: "network-only",
})

const FundItem = ({ pool }) => {
  const [{ poolMetadata }] = usePoolMetadata(pool.id, pool.descriptionURL)

  return (
    <FundWrapper>
      <Icon
        size={24}
        source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
        address={pool.id}
      />
    </FundWrapper>
  )
}

interface IPortaitsProps {}
const Pools = ({}: IPortaitsProps) => {
  const navigate = useNavigate()
  const { account } = useWeb3React()

  const [isModalOpen, setModal] = useState(false)

  const { owned, managed } = useSelector(selectInvolvedPoolsData(account))
  const { loading } = useSelector(selectPayload)

  const createFund = () => {
    navigate("/create-fund")
  }

  const fundsPreview = useMemo<ReactNode>(() => {
    if (owned && owned.length > 0) {
      return owned
        .slice(owned.length - 2)
        .map((pool) => <FundItem key={pool.id} pool={pool} />)
    }

    if (managed && managed.length > 0) {
      return managed
        .slice(managed.length - 2)
        .map((pool) => <FundItem key={pool.id} pool={pool} />)
    }

    return null
  }, [owned, managed])

  if (loading && !(owned.length > 0 || managed.length > 0)) {
    return (
      <PortraitsPlus>
        <CircleSpinner color="#A4EBD4" size={16} loading />
      </PortraitsPlus>
    )
  }

  console.log({ owned, managed })

  if (owned.length > 0 || managed.length > 0) {
    return (
      <>
        <OwnedPoolsList
          ownedPools={owned}
          managedPools={managed}
          isOpen={isModalOpen}
          toggle={() => setModal(false)}
        />
        <Funds onClick={() => setModal(true)}>{fundsPreview}</Funds>
      </>
    )
  }

  return (
    <Funds>
      <AddFund onClick={createFund} />
    </Funds>
  )
}

const PoolsWithProvider = () => {
  return (
    <GraphProvider value={poolsClient}>
      <Pools />
    </GraphProvider>
  )
}

export default PoolsWithProvider
