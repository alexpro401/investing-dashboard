import { FC, HTMLAttributes, useContext } from "react"
import { PoolProfileContext } from "pages/PoolProfile/context"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const FundDetailsWhitelist: FC<Props> = () => {
  const {} = useContext(PoolProfileContext)

  return <>FundDetailsWhitelist</>
}

export default FundDetailsWhitelist
