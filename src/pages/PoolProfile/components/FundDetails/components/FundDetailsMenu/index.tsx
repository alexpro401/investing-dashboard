import { FC, HTMLAttributes, useContext, useMemo } from "react"

import * as S from "./styled"
import { ICON_NAMES } from "consts"
import { PoolProfileContext } from "pages/PoolProfile/context"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const FundDetailsMenu: FC<Props> = ({ ...rest }) => {
  const { fundImageUrl } = useContext(PoolProfileContext)

  const menuItems = useMemo(() => {
    return [
      {
        title: "Fund Details",
        iconName: ICON_NAMES.fileDock,
      },
      {
        title: "Investment",
        iconName: ICON_NAMES.dollarOutline,
      },
      {
        title: "Limit who can invest",
        iconName: ICON_NAMES.usersGroup,
      },
      {
        title: "Fund manager",
        iconName: ICON_NAMES.users,
      },
      {
        title: "Performance Fee",
        iconName: ICON_NAMES.dollarOutline,
      },
    ]
  }, [])

  return (
    <S.Container>
      <S.FundAvatarWrp>
        <S.FundAvatarImg src={fundImageUrl} />
        <S.FundAvatarChangeBtn> Change fund photo</S.FundAvatarChangeBtn>
      </S.FundAvatarWrp>

      <S.MenuWrp>
        {menuItems.map((el, idx) => (
          <S.MenuItem key={idx}>
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
