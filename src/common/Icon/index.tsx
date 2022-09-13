import AngleLeftIcon from "assets/icons/AngleLeftIcon"
import AngleRightIcon from "assets/icons/AngleRightIcon"

import { ElementType, FC, HTMLAttributes, useMemo } from "react"
import { ICON_NAMES } from "constants/icon-names"
import styled from "styled-components"

interface Props extends HTMLAttributes<HTMLOrSVGElement> {
  name: ICON_NAMES
}

const IconContainer = styled.div``

const Icon: FC<Props> = ({ name, ...rest }) => {
  const SelectedIcon: ElementType = useMemo(() => {
    switch (name) {
      case ICON_NAMES.angleLeft:
        return AngleLeftIcon as unknown as ElementType
      case ICON_NAMES.angleRight:
        return AngleRightIcon as unknown as ElementType
      case ICON_NAMES.angleUp:
        return AngleLeftIcon as unknown as ElementType
      case ICON_NAMES.angleDown:
        return AngleLeftIcon as unknown as ElementType
      default:
        return AngleLeftIcon as unknown as ElementType
    }
  }, [name])

  return (
    <IconContainer>
      <SelectedIcon {...rest} />
    </IconContainer>
  )
}

export default Icon
