import { FC, HTMLAttributes, useContext, useMemo } from "react"

import * as S from "./styled"
import { ICON_NAMES, ROUTE_PATHS } from "consts"
import { PoolProfileContext } from "pages/PoolProfile/context"
import { generatePath } from "react-router-dom"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const FundDetailsMenu: FC<Props> = ({ ...rest }) => {
  const { fundImageUrl, fundAddress } = useContext(PoolProfileContext)

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
        routePath: currentLocationPath.concat("/general"),
      },
      {
        title: "Investment",
        iconName: ICON_NAMES.dollarOutline,
        routePath: currentLocationPath.concat("/investment"),
      },
      {
        title: "Limit who can invest",
        iconName: ICON_NAMES.usersGroup,
        routePath: currentLocationPath.concat("/whitelist"),
      },
      {
        title: "Fund manager",
        iconName: ICON_NAMES.users,
        routePath: currentLocationPath.concat("/manager"),
      },
      {
        title: "Performance Fee",
        iconName: ICON_NAMES.dollarOutline,
        routePath: currentLocationPath.concat("/fee"),
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
          <S.MenuItem key={idx} to={el.routePath}>
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
