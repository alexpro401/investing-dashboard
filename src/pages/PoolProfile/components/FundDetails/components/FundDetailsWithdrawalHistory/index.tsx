import { Flex } from "theme"
import WithdrawalsHistory from "components/WithdrawalsHistory"
import { useContext } from "react"
import { PoolProfileContext } from "pages/PoolProfile/context"

export const FundDetailsWithdrawalsHistory = () => {
  const { fundAddress, perfomanceFee } = useContext(PoolProfileContext)

  if (!perfomanceFee) return <></>

  return (
    <Flex dir="column" full m="40px 0 0">
      <WithdrawalsHistory
        unlockDate={perfomanceFee.unlockDate}
        poolAddress={fundAddress || ""}
      />
    </Flex>
  )
}

export default FundDetailsWithdrawalsHistory
