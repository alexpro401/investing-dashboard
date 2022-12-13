import { useWeb3React } from "@web3-react/core"

import Wallet from "assets/menu/mobile/Wallet"
import Profile from "assets/menu/mobile/Profile"
import TopTraders from "assets/menu/mobile/TopTraders"
import Insurance from "assets/menu/mobile/Insurance"
import Dao from "assets/menu/mobile/Dao"

import { MobileMenu, NavItem } from "./styled"
import { shortenAddress } from "utils"
import { FC } from "react"
import { MotionProps } from "framer-motion"

interface Props extends MotionProps {}

export const TapBar: FC<Props> = ({ ...rest }) => {
  const { account } = useWeb3React()

  const isBarHidden = !account ? "hidden" : "visible"

  return (
    <MobileMenu
      initial={isBarHidden}
      animate={isBarHidden}
      variants={{
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
      }}
      {...rest}
    >
      <NavItem path="/wallet" Icon={Wallet} text={shortenAddress(account, 3)} />
      <NavItem path="/me/trader" Icon={Profile} text="My profile" />
      <NavItem path="/" Icon={TopTraders} text="Traders" />
      <NavItem path="/dao/list/top" Icon={Dao} text="DAO" />
      <NavItem path="/insurance" Icon={Insurance} text="Insurance" />
    </MobileMenu>
  )
}
export default TapBar
