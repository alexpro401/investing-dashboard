import { useMemo, useState, ReactNode, HTMLAttributes, FC } from "react"
import { useWeb3React } from "@web3-react/core"
import { useNavigate } from "react-router-dom"
import { CircleSpinner } from "react-spinners-kit"
import { useSelector } from "react-redux"

import Icon from "components/Icon"
import OwnedPoolsList from "modals/OwnedPoolsList"

import { selectPayload } from "state/pools/selectors"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { selectInvolvedPoolsData } from "state/user/selectors"

import AddFund from "assets/icons/AddFund"

import * as S from "./styled"
import { ROUTE_PATHS } from "consts"

const FundItem = ({ pool }) => {
  const [{ poolMetadata }] = usePoolMetadata(pool.id, pool.descriptionURL)

  return (
    <S.FundWrapper>
      <Icon
        size={24}
        source={poolMetadata?.assets[poolMetadata?.assets.length - 1]}
        address={pool.id}
      />
    </S.FundWrapper>
  )
}

interface Props extends HTMLAttributes<HTMLDivElement> {}

const AccountInvestmentPools: FC<Props> = ({ ...rest }) => {
  const navigate = useNavigate()
  const { account } = useWeb3React()

  const [isModalOpen, setModal] = useState(false)

  const { owned, managed } = useSelector(selectInvolvedPoolsData(account))
  const { loading } = useSelector(selectPayload)

  const createFund = () => {
    navigate(ROUTE_PATHS.createFund)
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
      <S.PortraitsPlus>
        <CircleSpinner color="#A4EBD4" size={16} loading />
      </S.PortraitsPlus>
    )
  }

  if (owned.length > 0 || managed.length > 0) {
    return (
      <>
        <OwnedPoolsList
          ownedPools={owned}
          managedPools={managed}
          isOpen={isModalOpen}
          toggle={() => setModal(false)}
        />
        <S.Funds onClick={() => setModal(true)}>{fundsPreview}</S.Funds>
      </>
    )
  }

  return (
    <S.Funds {...rest}>
      <AddFund onClick={createFund} />
    </S.Funds>
  )
}

export default AccountInvestmentPools
