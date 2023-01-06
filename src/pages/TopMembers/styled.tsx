import styled from "styled-components/macro"
import { respondTo } from "theme"
import { motion } from "framer-motion"
import { AppButton, Icon } from "common"
import RouteTabs from "components/RouteTabs"
import { ToggleSearchField } from "fields"
import TradersSort from "components/TradersSort"
import { ICON_NAMES } from "consts"

export const StyledTopMembers = styled(motion.div)`
  height: fit-content;
  padding: 0 24px;
`

export const MembersList = styled.div`
  width: 100%;
`

export const LoadingText = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  letter-spacing: 0.1px;
  color: #fff;
  margin-top: 30px;
`

export const ListContainer = styled(motion.div)`
  /* overflow-y: hidden;
  touch-action: none;
  overscroll-behavior: none; */

  padding: 0;
`

export const CardIconWrp = styled.div`
  flex: 1 0 7px;
  svg {
    width: 7px;
    height: 12px;
  }
`

export const TopMembersPromoBlock = styled.div`
  display: none;
  align-items: center;
  background: #101520;
  border-radius: 20px;
  gap: 12px;

  ${respondTo("xs")} {
    display: flex;
  }
`

export const TopMembersPromoBlockImg = styled.img``

export const TopMembersPromoBlockDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const TopMembersPromoBlockDetailsTitle = styled.h3`
  font-size: 20px;
  line-height: 1.2;
  font-weight: 700;
  margin: 0;
  color: ${(props) => props.theme.textColors.secondary};
`

export const TopMembersPromoBlockDetailsLink = styled.a`
  text-decoration: none;
  color: ${(props) => props.theme.brandColors.secondary};
  font-size: 16px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 0.01em;
`

export const TopMembersPromoBlockActionBtn = styled(AppButton)`
  margin-left: auto;
  border: none;
`

export const TopMembersHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content;
  gap: 19px;
  margin: 18px 0;

  ${respondTo("xmd")} {
    display: flex;
    align-items: center;
    gap: 24px;
  }
`

export const TopMembersTitle = styled.h2`
  white-space: nowrap;
  font-weight: 900;
  font-size: 24px;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.textColors.primary};
  margin: 0;

  ${respondTo("sm")} {
    font-size: 28px;
  }
`

export const TopMembersRouteTabsWrp = styled(RouteTabs)`
  grid-column: 1 / -1;
  grid-row: 2 / 3;

  ${respondTo("xmd")} {
    max-width: 365px;
  }
`

export const TopMembersFiltersWrp = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: auto;
  gap: 24px;
  width: 100%;

  ${respondTo("xs")} {
    width: auto;
  }
`

export const ToggleSearchFieldWrp = styled(ToggleSearchField)``

export const TopMembersSearchIcon = styled(Icon)`
  color: #6781bd;
  -webkit-text-fill-color: #6781bd;
`

export const TopMembersFiltersBtn = styled(AppButton).attrs(() => ({
  iconSize: 24,
  color: "secondary",
  size: "small",
  iconLeft: ICON_NAMES.filter,
}))`
  padding: 8px 8px;
  font-size: 14px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 0.01em;
  grid-gap: 4px;
  background: #141926;
  border-radius: 12px;
  color: #6781bd;
`

export const TradersSortWrp = styled(TradersSort)`
  position: absolute;
  top: 110%;
  right: 0;
  width: max-content;
`
