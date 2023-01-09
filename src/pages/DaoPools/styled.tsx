import { motion } from "framer-motion"
import styled, { css } from "styled-components/macro"
import { AppButton, Icon } from "common"
import { respondTo } from "theme"
import { InputField } from "fields"
import RouteTabs from "components/RouteTabs"

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const Container = styled(motion.div).attrs(() => ({
  variants,
  initial: "hidden",
  animate: "visible",
  exit: "hidden",
  transition: { duration: 0.2 },
}))`
  display: grid;
  grid-template-rows: max-content 1fr;
  grid-gap: var(--app-gap);
  overflow: hidden;
  padding: var(--app-padding);
  padding-bottom: 0;
`

export const Indents = styled.div<{ top?: boolean; side?: boolean }>`
  width: 100%;
`

export const Action = styled(AppButton).attrs(() => ({
  color: "default",
  size: "small",
}))`
  padding: 0;
`

const centerGridItem = css`
  display: flex;
  justify-content: center;
  align-content: center;
`

export const List = {
  Container: styled.div`
    display: grid;
    grid-template-rows: max-content 1fr;
    grid-gap: 16px;
    overflow: hidden;
  `,
  Header: styled.div`
    display: grid;
    grid-template-columns: 1fr max-content;
    gap: 19px;

    ${respondTo("sm")} {
      display: flex;
      align-items: center;
      gap: 24px;
    }
  `,
  Title: styled.h2`
    font-size: 28px;
    line-height: 1.25;
    font-weight: 900;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.textColors.primary};
    margin: 0;
  `,
  Scroll: styled.div<{ center: boolean }>`
    display: flex;
    flex-direction: column;
    gap: var(--app-gap);
    overflow-y: auto;

    ${({ center }) => (center ? centerGridItem : "")};
  `,
  RouteTabsWrp: styled(RouteTabs)`
    ${respondTo("sm")} {
      max-width: 365px;
    }
  `,
  FiltersWrp: styled.div`
    display: flex;
    align-items: center;
    margin-left: auto;
    gap: 24px;
  `,
  SearchInput: styled(InputField)`
    label {
      font-size: 14px;
      line-height: 1.5;
      font-weight: 500;
      letter-spacing: 0.01em;
      color: #6781bd;
      -webkit-text-fill-color: #6781bd;
    }

    & input {
      background: #101520;
      border-radius: 16px;
      border: none;
      padding-top: 9px;
      padding-bottom: 9px;
      font-size: 14px;
      line-height: 1.5;
      font-weight: 500;
      letter-spacing: 0.01em;
      color: #6781bd;
      -webkit-text-fill-color: #6781bd;

      &:not(:read-only),
      &:-webkit-autofill,
      &:-webkit-autofill:focus {
        box-shadow: inset 0 0 0 50px #101520;
        background: #101520;
      }
    }
  `,
  SearchIcon: styled(Icon)`
    color: #6781bd;
    -webkit-text-fill-color: #6781bd;
  `,
  FiltersBtn: styled(AppButton).attrs(() => ({
    iconSize: "1.4em",
  }))`
    color: ${({ theme }) => theme.brandColors.secondary};
    padding: 8px 8px;
    font-size: 14px;
    line-height: 1.2;
    font-weight: 700;
    letter-spacing: 0.01em;
    grid-gap: 4px;
  `,
  CardIconWrp: styled.div`
    flex: 1 0 7px;
    svg {
      width: 7px;
      height: 12px;
    }
  `,
}

export const PromoBlock = styled.div`
  display: flex;
  align-items: center;
  background: #101520;
  border-radius: 20px;
  gap: 12px;
`

export const PromoBlockImg = styled.img``

export const PromoBlockDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const PromoBlockDetailsTitle = styled.h3`
  font-size: 20px;
  line-height: 1.2;
  font-weight: 700;
  margin: 0;
  color: ${(props) => props.theme.textColors.secondary};
`

export const PromoBlockDetailsLink = styled.a`
  text-decoration: none;
  color: ${(props) => props.theme.brandColors.secondary};
  font-size: 16px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 0.01em;
`

export const PromoBlockActionBtn = styled(AppButton)`
  margin-left: auto;
  border: none;
`
