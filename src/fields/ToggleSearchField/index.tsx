import { AnimatePresence, MotionProps } from "framer-motion"

import * as S from "./styled"
import { ICON_NAMES } from "consts"
import { FC } from "react"

interface Props extends MotionProps {
  modelValue: string
  updateModelValue: (value: string) => void
  isToggled: boolean
  setIsToggled?: (isToggled: boolean) => void
}

const ToggleSearchField: FC<Props> = ({
  isToggled,
  setIsToggled,
  modelValue,
  updateModelValue,
  ...rest
}) => {
  return (
    <S.ToggleSearchInputWrp
      animate={{
        width: isToggled ? "40px" : "150px",
      }}
      {...rest}
    >
      <S.ToggleSearchButton
        onClick={() => setIsToggled && setIsToggled(!isToggled)}
      >
        <S.ToggleSearchIcon name={ICON_NAMES.search} />
      </S.ToggleSearchButton>
      <S.ToggleSearchInput
        placeholder="Search"
        value={modelValue}
        onChange={(e) => updateModelValue(e.currentTarget.value)}
      />
    </S.ToggleSearchInputWrp>
  )
}

export default ToggleSearchField
