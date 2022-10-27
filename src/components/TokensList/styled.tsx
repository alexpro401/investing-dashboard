import { AppButton } from "common"
import styled from "styled-components"
import theme, { Flex } from "theme"

// TOKEN ITEM

export const TokenInfo = styled(Flex)`
  flex-direction: column;
  flex: 1;
  align-items: flex-start;
`

export const Symbol = styled.div`
  overflow: hidden;
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  font-feature-settings: "tnum" on, "lnum" on;
  color: ${({ theme }) => theme.textColors.primary};
  text-align: left;
`

export const Name = styled.div`
  position: relative;
  overflow: hidden;
  max-width: 150px;
  height: 15px;
  text-overflow: ellipsis;
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: 0.03em;
  font-feature-settings: "tnum" on, "lnum" on;
  color: ${({ theme }) => theme.textColors.secondary};
  text-align: left;
`

export const BalanceInfo = styled(Flex)`
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`

export const TokenBalance = styled.div`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  text-align: right;
  color: ${({ theme }) => theme.textColors.primary};
`

export const TokenPrice = styled.div`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 15px;
  text-align: right;
  color: ${({ theme }) => theme.statusColors.success};
`

export const Blacklist = styled.div`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 700;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: 0.03em;
  font-feature-settings: "tnum" on, "lnum" on;
  color: ${({ theme }) => theme.statusColors.error};
`

export const TokenContainer = styled(Flex)<{ disabled?: boolean }>`
  width: fill-available;
  box-sizing: border-box;
  height: 50px;
  justify-content: flex-start;
  padding: 0 16px;
  transition: background 0.2s ease-in-out;
  &:hover {
    background: linear-gradient(
      264.39deg,
      rgba(255, 255, 255, 0) -58.22%,
      rgba(255, 255, 255, 0.04) 116.91%
    );
  }

  ${Symbol} {
    color: ${({ theme, disabled }) => disabled && theme.textColors.secondary};
    opacity: ${({ disabled }) => disabled && 0.5};
  }
  ${Name} {
    opacity: ${({ disabled }) => disabled && 0.5};
  }
  ${TokenBalance} {
    opacity: ${({ disabled }) => disabled && 0.5};
  }
  img {
    opacity: ${({ disabled }) => disabled && 0.5};
  }
  cursor: ${({ disabled }) => disabled && "not-allowed"};
`

export const RemoveButton = styled(AppButton)`
  padding: 0;
  border-radius: 0;
`

// LIST ROW

// list row container
export const ListRow = styled(Flex)`
  margin: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  gap: 16px;

  width: fill-available;
  height: 64px;

  /* Main color/dark gray */

  background: #141926;
  border-radius: 24px;
  box-sizing: border-box;
`

// list row content
export const ListRowContent = styled(Flex)`
  /* Auto layout */

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 8px;

  height: 40px;

  /* Inside auto layout */

  flex: 1 0 auto;
  order: 0;
`

// list row tokens counter
export const ListRowTokensCounter = styled(Flex)`
  align-items: center;
  padding: 0px;
  gap: 5px;

  height: 16px;

  /* Inside auto layout */

  flex: none;
  order: 1;
  flex-grow: 0;

  font-family: "Gilroy";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  /* identical to box height */

  letter-spacing: 0.03em;
  font-feature-settings: "tnum" on, "lnum" on;

  /* Text/2 */

  color: ${theme.textColors.secondary};
`

// list row name
export const ListRowName = styled.div`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  font-feature-settings: "tnum" on, "lnum" on;
  color: ${theme.textColors.primary};
  max-width: 135px;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Error = styled.div`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 15px;
  letter-spacing: 0.03em;
  text-align: center;
  font-feature-settings: "tnum" on, "lnum" on;
  color: #db6d6d;
`

// static list card

export const StaticListCard = styled(Flex)`
  padding: 12px 16px;
  margin: 0 16px;
  gap: 16px;
  box-sizing: border-box;

  width: fill-available;
  height: 64px;

  /* Main color/dark gray */

  background: #141926;
  border-radius: 24px;

  /* Inside auto layout */

  flex: none;
  order: 3;
  flex-grow: 0;
`

export const StaticListCardContent = styled(Flex)`
  /* Auto layout */
  padding: 0px;
  gap: 8px;

  height: 40px;

  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 0;
`

export const StaticListCardInfo = styled(Flex)`
  /* Auto layout */
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 4px;

  height: 40px;

  /* Inside auto layout */

  flex: none;
  order: 1;
  flex-grow: 0;
`

export const StaticListCardName = styled.div`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  font-feature-settings: "tnum" on, "lnum" on;

  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;

  /* Text/main */

  color: ${theme.textColors.primary};

  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 0;
`

export const StaticListCardTokens = styled.div`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  /* identical to box height */

  letter-spacing: 0.03em;
  font-feature-settings: "tnum" on, "lnum" on;

  /* Text/2 */

  color: #b1c7fc;

  /* Inside auto layout */

  flex: none;
  order: 1;
  flex-grow: 0;
`

export const StaticListCardLink = styled.a`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 15px;
  /* identical to box height */

  letter-spacing: 0.03em;
  font-feature-settings: "tnum" on, "lnum" on;

  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;

  /* Text/link */

  color: ${theme.brandColors.secondary};
  text-decoration: none;
`

export const PopoverWrapper = styled.div`
  position: relative;
`

export const PopoverContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px;
  box-sizing: border-box;
  gap: 16px;

  position: absolute;
  width: 154px;
  height: 44px;
  left: 5px;
  top: 7px;
  z-index: 120;

  /* Additional color / tooltip */

  background: #28334a;
  border-radius: 16px;
`
