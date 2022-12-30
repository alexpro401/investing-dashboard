import { useWeb3React } from "@web3-react/core"

import Profile from "assets/menu/mobile/Profile"
import TopTraders from "assets/menu/mobile/TopTraders"
import Insurance from "assets/menu/mobile/Insurance"
import Dao from "assets/menu/mobile/Dao"

import { MobileMenu, NavItem, DesktopLogo } from "./styled"
import { FC } from "react"
import { MotionProps } from "framer-motion"
import { ROUTE_PATHS } from "consts"

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
      <DesktopLogo />
      <NavItem path={ROUTE_PATHS.meTrader} Icon={Profile} text="My profile" />
      <NavItem path={ROUTE_PATHS.topMembers} Icon={TopTraders} text="Traders" />
      <NavItem path="/dao/list/top" Icon={Dao} text="DAO" />
      <NavItem path={ROUTE_PATHS.insurance} Icon={Insurance} text="Insurance" />
    </MobileMenu>
  )
}
export default TapBar
