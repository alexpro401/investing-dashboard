import { FC, HTMLAttributes, useContext } from "react"
import { PoolProfileContext } from "pages/PoolProfile/context"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const FundDetailsInvestment: FC<Props> = () => {
  const {} = useContext(PoolProfileContext)

  return <>FundDetailsInvestment</>
}

export default FundDetailsInvestment
