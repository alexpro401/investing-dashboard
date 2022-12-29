import { useWeb3React } from "@web3-react/core"

import Profile from "assets/menu/mobile/Profile"
import TopTraders from "assets/menu/mobile/TopTraders"
import Insurance from "assets/menu/mobile/Insurance"
import Dao from "assets/menu/mobile/Dao"

import { MobileMenu, NavItem, LogoWrapper } from "./styled"
import { FC } from "react"
import { MotionProps } from "framer-motion"
import { Icon } from "common"
import { ICON_NAMES } from "consts/icon-names"

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
      <LogoWrapper>
        <Icon name={ICON_NAMES.logoIcon} />
      </LogoWrapper>
      <NavItem path="/me/trader" Icon={Profile} text="My profile" />
      <NavItem path="/" Icon={TopTraders} text="Traders" />
      <NavItem path="/dao/list/top" Icon={Dao} text="DAO" />
      <NavItem path="/insurance" Icon={Insurance} text="Insurance" />
    </MobileMenu>
  )
}
export default TapBar
