import { FC, HTMLAttributes, useContext } from "react"
import { PoolProfileContext } from "pages/PoolProfile/context"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const FundDetailsManager: FC<Props> = () => {
  const {} = useContext(PoolProfileContext)

  return <>FundDetailsManager</>
}

export default FundDetailsManager
