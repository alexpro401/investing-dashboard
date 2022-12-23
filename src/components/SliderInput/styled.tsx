import styled from "styled-components/macro"
import { Flex } from "theme"

export const SliderLine = styled.div`
  width: 100%;
  background: #2f333b;
  border-radius: 2px;
  height: 4px;
  max-width: 20%;
  margin-right: -3px;
  margin-left: -3px;
`

const Percent = styled.input`
  background: transparent;
  -webkit-appearance: none;
  outline: none;
  border: none;
  border-radius: 0;
  width: 35px;
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-family: ${(props) => props.theme.appFontFamily};
  font-weight: 400;
  font-size: 16px;
  line-height: 41px;
  color: #a4ebd4;
  position: relative;
`

const InputWrapper = styled(Flex)`
  position: relative;
`

const InputSymbol = styled.span`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-family: ${(props) => props.theme.appFontFamily};
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  color: #a4ebd4;
`

export const NumberInput = ({ value, onChange, onClick }) => (
  <InputWrapper>
    <Percent
      onClick={onClick}
      onChange={(v) => onChange(v.target.value)}
      type="number"
      value={value}
    />
    <InputSymbol>%</InputSymbol>
  </InputWrapper>
)
