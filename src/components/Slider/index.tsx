import { useState, useEffect } from "react"
import { Flex } from "theme"
import InputSlider from "rc-slider"
import useDebounce from "hooks/useDebounce"
import { focusText } from "utils"

import {
  SliderLine,
  Percent,
  InputWrapper,
  InputSymbol,
  SliderStyle,
  SliderWrapper,
} from "./styled"

export const NumberInput = ({ value, onChange, onClick, isError }) => (
  <InputWrapper isError={isError}>
    <Percent
      onClick={onClick}
      onChange={(v) => onChange(v.target.value)}
      type="number"
      value={value}
    />
    <InputSymbol>%</InputSymbol>
  </InputWrapper>
)

interface Props {
  name: string
  initial: number
  hideInput?: boolean
  debounce?: boolean
  limits: { min: number; max: number }
  onChange: (name: string, value: number) => void
  error?: boolean
  isShowSliderLine?: boolean
}

const Slider: React.FC<Props> = ({
  name,
  initial,
  limits,
  hideInput = false,
  debounce = true,
  onChange,
  error = false,
  isShowSliderLine = true,
  ...rest
}) => {
  const [v, setV] = useState(initial)
  const debounced = useDebounce(v, 250)
  const { min, max } = limits

  useEffect(() => {
    if (debounce) {
      onChange(name, debounced)
    }
  }, [debounced, onChange, name, debounce])

  const handleChange = (value) => {
    if (debounce) {
      setV(value)
      return
    }

    onChange(name, value)
  }

  return (
    <SliderWrapper {...rest}>
      <SliderStyle />
      <Flex full p="0 4px 10px 8px">
        <Flex full ai="center">
          {min !== 0 && <SliderLine />}
          <InputSlider
            min={min}
            max={max}
            value={debounce ? v : initial}
            onChange={handleChange}
          />
          {isShowSliderLine && max !== 100 && <SliderLine />}
        </Flex>
        {!hideInput && (
          <Flex p="0 0 0 20px">
            <NumberInput
              onClick={focusText}
              onChange={handleChange}
              value={debounce ? v : initial}
              isError={error}
            />
          </Flex>
        )}
      </Flex>
    </SliderWrapper>
  )
}

export default Slider
