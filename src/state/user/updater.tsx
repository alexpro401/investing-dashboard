import { useEffect } from "react"
import { useWeb3React } from "@web3-react/core"
import { useSelector, useDispatch } from "react-redux"

import useContract from "hooks/useContract"
import { AppDispatch } from "state"
import { UserRegistry } from "abi"
import { addOwnedPools, changeTermsAgreed } from "state/user/actions"
import { selectUserRegistryAddress } from "state/contracts/selectors"
import { usePoolRegistryContract } from "contracts"

export const UserPoolsUpdater: React.FC = () => {
  const { account } = useWeb3React()

  const dispatch = useDispatch<AppDispatch>()

  const traderPoolRegistry = usePoolRegistryContract()

  useEffect(() => {
    if (!traderPoolRegistry || !account) return
    ;(async () => {
      try {
        // get pool type names
        const basicPoolName = await traderPoolRegistry.BASIC_POOL_NAME()
        const investPoolName = await traderPoolRegistry.INVEST_POOL_NAME()

        // get user owned pools
        const traderBasicPools = await traderPoolRegistry.listAssociatedPools(
          account,
          basicPoolName,
          0,
          25
        )
        const traderInvestPools = await traderPoolRegistry.listAssociatedPools(
          account,
          investPoolName,
          0,
          25
        )
        dispatch(
          addOwnedPools({ basic: traderBasicPools, invest: traderInvestPools })
        )
      } catch (e) {
        // TODO: handle error
      }
    })()
  }, [traderPoolRegistry, account, dispatch])

  return null
}

export const UserTermsUpdater: React.FC = () => {
  const { account } = useWeb3React()

  const userRegistryAddress = useSelector(selectUserRegistryAddress)
  const userRegistry = useContract(userRegistryAddress, UserRegistry)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (!userRegistry || !account) return
    ;(async () => {
      try {
        const agreed = await userRegistry.agreed(account)

        dispatch(changeTermsAgreed({ agreed }))
      } catch (error) {
        console.error(error)
      }
    })()
  }, [userRegistry, account, dispatch])

  return null
}
