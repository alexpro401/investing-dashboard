import * as React from "react"
import {
  DaoProfileEmptyBalanceCard,
  DaoProfileUserBalancesCard,
} from "../components"
import { Indents } from "../styled"

const DaoProfileTabBalance: React.FC = () => {
  return (
    <>
      <DaoProfileEmptyBalanceCard />
      <Indents top side={false}>
        <DaoProfileUserBalancesCard />
      </Indents>
    </>
  )
}

export default DaoProfileTabBalance
