import styled from "styled-components"
import { Collapse } from "common"

export const Root = styled.div<{
  isDisabled?: boolean
  isReadonly?: boolean
}>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  flex: 1;

  ${(props) => (props.isDisabled || props.isReadonly ? "opacity: 0.5" : "")}
`

export const DropdownParsedVariants = styled(Collapse)`
  overflow: hidden;
  position: absolute;
  top: 125%;
  left: 0;
  width: 100%;
  z-index: 1;
  background: ${(props) => props.theme.backgroundColors.secondary};
  border: 1px solid #293c54;
  border-radius: 16px;

  & > * {
    justify-content: flex-start;
    width: 100%;
  }
`
