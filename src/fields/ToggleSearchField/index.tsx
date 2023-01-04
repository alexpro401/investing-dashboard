import { AnimatePresence, MotionProps } from "framer-motion"

import * as S from "./styled"
import { ICON_NAMES } from "consts"
import { FC } from "react"

interface Props extends MotionProps {
  modelValue: string
  updateModelValue: (value: string) => void
  isToggled: boolean
  setIsToggled: (isToggled: boolean) => void
}

const ToggleSearchField: FC<Props> = ({
  isToggled,
  setIsToggled,
  modelValue,
  updateModelValue,
}) => {
  return (
    <S.ToggleSearchInputWrp
      animate={
        isToggled
          ? {
              width: "40px",
            }
          : {
              width: "auto",
            }
      }
    >
      <S.ToggleSearchButton onClick={() => setIsToggled(!isToggled)}>
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
