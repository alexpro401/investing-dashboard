import { AppButton, Icon } from "common"
import { ICON_NAMES } from "constants/icon-names"
import styled from "styled-components"
import { Flex } from "theme"

export const Container = styled(Flex)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 16px;
  grid-row-gap: 16px;
  max-height: 490px;
  overflow-y: auto;
  width: fill-available;
  height: fit-content;
  padding: 5px 16px 0;
  position: relative;

  &:before {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    width: 100%;
    content: "";
    height: 1px;
    background: radial-gradient(
        54.8% 53% at 50% 50%,
        #587eb7 0%,
        rgba(88, 126, 183, 0) 100%
      ),
      radial-gradient(
        60% 51.57% at 50% 50%,
        #6d99db 0%,
        rgba(109, 153, 219, 0) 100%
      ),
      radial-gradient(
        69.43% 69.43% at 50% 50%,
        rgba(5, 5, 5, 0.5) 0%,
        rgba(82, 82, 82, 0) 100%
      );
    opacity: 0.1;
  }
`

export const Check = styled(Icon).attrs({ name: ICON_NAMES.tileCheck })`
  position: absolute;
  right: 8px;
  top: 8px;

  & > circle {
    fill: none;
    stroke: #181e2c;
  }
  & > path {
    fill: none;
  }
`

export const Card = styled(Flex)<{ url: string; isSelected?: boolean }>`
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  background: #000000;
  border: 1px solid #293c54;
  border-radius: 20px;
  align-self: center;
  justify-self: start;
  position: relative;

  background-image: url(${({ url }) => url});
  background-size: contain;
  cursor: pointer;

  &:hover {
    transition: border 0.1s ease-in-out;
    border: 1px solid #7fffd4;
  }

  &:nth-child(odd) {
    justify-self: end;
  }

  ${Check} {
    & > path {
      stroke: ${({ isSelected }) => (isSelected ? "#7fffd4" : "none")};
    }
    & > circle {
      fill: ${({ isSelected }) => (isSelected ? "#141926" : "#141926")};
      stroke: ${({ isSelected }) => (isSelected ? "#7fffd4" : "#181e2c")};
    }
  }

  &:hover {
    ${Check} {
      & > circle {
        fill: #141926;
        stroke: #7fffd4;
      }
    }
  }
`

export const CardInfo = styled(Flex)`
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px;
  gap: 10px;
  box-sizing: border-box;

  position: absolute;
  height: 32px;
  width: fill-available;
  left: 4px;
  top: 112px;
  right: 4px;
  margin: auto;

  background: #141926;
  border-radius: 26px;
`

export const NftId = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  text-align: left;
  color: #e4f2ff;
  flex: none;
  order: 0;
  flex-grow: 0;
`

export const VotingPowerAmount = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  text-align: right;
  color: #9ae2cb;

  flex: none;
  order: 0;
  flex-grow: 0;
`

export const Button = styled(AppButton)`
  width: fill-available;
  margin: 16px;
`
