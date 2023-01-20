import { FC, HTMLAttributes, useContext, useMemo } from "react"

import * as S from "./styled"
import { ICON_NAMES, ROUTE_PATHS } from "consts"
import { PoolProfileContext } from "pages/PoolProfile/context"
import { generatePath, useNavigate } from "react-router-dom"
import { useBreakpoints } from "hooks"
import { Bus } from "helpers"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const FundDetailsMenu: FC<Props> = ({ ...rest }) => {
  const { fundImageUrl, fundAddress } = useContext(PoolProfileContext)

  const navigate = useNavigate()

  const { isSmallTablet } = useBreakpoints()

  const currentLocationPath = useMemo(
    () =>
      generatePath(ROUTE_PATHS.poolProfile, {
        poolAddress: fundAddress || "",
        "*": "details",
      }),
    [fundAddress]
  )

  const menuItems = useMemo(() => {
    return [
      {
        title: "Fund Details",
        iconName: ICON_NAMES.fileDock,
        handleClick: () => {
          if (isSmallTablet) {
            Bus.emit("manage-modal/general")
          } else {
            navigate(currentLocationPath.concat("/general"))
          }
        },
      },
      {
        title: "Investment",
        iconName: ICON_NAMES.dollarOutline,
        handleClick: () => {
          if (isSmallTablet) {
            Bus.emit("manage-modal/investment")
          } else {
            navigate(currentLocationPath.concat("/investment"))
          }
        },
      },
      {
        title: "Limit who can invest",
        iconName: ICON_NAMES.usersGroup,
        handleClick: () => {
          if (isSmallTablet) {
            Bus.emit("manage-modal/whitelist")
          } else {
            navigate(currentLocationPath.concat("/whitelist"))
          }
        },
      },
      {
        title: "Fund manager",
        iconName: ICON_NAMES.users,
        handleClick: () => {
          if (isSmallTablet) {
            Bus.emit("manage-modal/manager")
          } else {
            navigate(currentLocationPath.concat("/manager"))
          }
        },
      },
      {
        title: "Performance Fee",
        iconName: ICON_NAMES.dollarOutline,
        handleClick: () => {
          if (isSmallTablet) {
            Bus.emit("manage-modal/fee")
          } else {
            navigate(currentLocationPath.concat("/fee"))
          }
        },
      },
    ]
  }, [currentLocationPath])

  return (
    <S.Container>
      <S.FundAvatarWrp>
        <S.FundAvatarImg src={fundImageUrl} />
        <S.FundAvatarChangeBtn> Change fund photo</S.FundAvatarChangeBtn>
      </S.FundAvatarWrp>

      <S.MenuWrp>
        {menuItems.map((el, idx) => (
          <S.MenuItem key={idx} onClick={el.handleClick}>
            <S.MenuItemIconLeft name={el.iconName} />
            {el.title}
            <S.MenuItemIconRight name={ICON_NAMES.angleRight} />
          </S.MenuItem>
        ))}
      </S.MenuWrp>
    </S.Container>
  )
}

export default FundDetailsMenu
