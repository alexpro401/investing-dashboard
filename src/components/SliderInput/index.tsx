import { useEffect, useState } from "react"
import useDebounce from "hooks/useDebounce"
import InputSlider from "rc-slider"
import { Flex } from "theme"
import { focusText } from "utils"

import * as S from "./styled"

const SliderInput: React.FC<{
  name: string
  initial: number
  hideInput?: boolean
  customMarks?: any
  debounce?: boolean
  onChange: (name: string, value: number) => void
  min?: number
  max?: number
}> = ({
  name,
  initial,
  onChange,
  hideInput = false,
  debounce = true,
  min = 30,
  max = 70,
  customMarks = {
    30: "30%",
    40: "40%",
    50: "50%",
    60: "60%",
    70: "70%",
  },
}) => {
  const [v, setV] = useState(initial)
  const debounced = useDebounce(v, 250)

  useEffect(() => {
    if (debounce) {
      onChange(name, debounced)
    }
  }, [debounced, onChange, name, debounce])

  const handleChange = (value) => {
    if (value in customMarks) {
      vibrate()
    }

    if (debounce) {
      setV(value)
      return
    }

    onChange(name, value)
  }

  const vibrate = () => {
    if (!window) {
      return
    }

    if (!window.navigator) {
      return
    }

    if (!window.navigator.vibrate) {
      return
    }
    window.navigator.vibrate(50)
  }

  return (
    <Flex full p="0 0 10px">
      <Flex full p="24px 0" ai="center">
        {min !== 0 && <S.SliderLine />}
        <InputSlider
          marks={customMarks}
          min={min}
          max={max}
          value={debounce ? v : initial}
          onChange={handleChange}
        />
        {max !== 100 && <S.SliderLine />}
      </Flex>
      {!hideInput && (
        <Flex p="0 0 0 20px">
          <S.NumberInput
            onClick={focusText}
            onChange={handleChange}
            value={debounce ? v : initial}
          />
        </Flex>
      )}
    </Flex>
  )
}

export default SliderInput
