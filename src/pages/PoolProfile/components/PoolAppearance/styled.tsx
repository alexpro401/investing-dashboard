import styled from "styled-components/macro"
import { respondTo } from "theme"
import { Icon } from "common"
import { ICON_NAMES } from "consts"

export const PoolAppearanceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const PoolAppearanceImgWrp = styled.div`
  overflow: hidden;
  max-width: 38px;
  max-height: 38px;
  width: 100%;
  height: 100%;
  border-radius: 50%;

  ${respondTo("xs")} {
    max-width: 100px;
    max-height: 100px;
  }
`

export const PoolAppearanceImg = styled.img`
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
`

export const PoolAppearanceDetails = styled.div`
  display: flex;
  flex-direction: column;
`

export const PoolAppearanceTitles = styled.div`
  align-self: flex-start;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;

  ${respondTo("xs")} {
    background: transparent;
    flex-direction: row;
    gap: 4px;
  }
`

export const PoolAppearanceShareBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 105%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.brandColors.secondary};
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
`

export const PoolAppearanceShareIcon = styled(Icon).attrs({
  name: ICON_NAMES.share,
})`
  width: 14px;
  height: 14px;
`

export const PoolAppearanceSymbol = styled.div`
  font-size: 16px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 1px;
  color: ${(props) => props.theme.textColors.primary};

  ${respondTo("xs")} {
    align-self: baseline;
    text-transform: uppercase;
    font-size: 36px;
    line-height: 1.3;
    font-weight: 900;
    letter-spacing: -0.01em;
    color: ${(props) => props.theme.brandColors.secondary};
  }
`

export const PoolAppearanceName = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: ${(props) => props.theme.textColors.secondary};

  ${respondTo("xs")} {
    align-self: baseline;
    font-size: 20px;
    line-height: 1.25;
    font-weight: 900;
    color: #6781bd;
  }
`
