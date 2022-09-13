import AngleLeftIcon from "assets/icons/AngleLeftIcon"
import AngleRightIcon from "assets/icons/AngleRightIcon"
import CloseIcon from "assets/icons/CloseIcon"
import DollarOutlineIcon from "assets/icons/DollarOutlineIcon"
import GlobeIcon from "assets/icons/GlobeIcon"
import ShieldCheckIcon from "assets/icons/ShieldCheckIcon"
import StarIcon from "assets/icons/StarIcon"
import FileDockIcon from "assets/icons/FileDockIcon"

import { ElementType, FC, HTMLAttributes, useMemo } from "react"
import { ICON_NAMES } from "constants/icon-names"

interface Props extends HTMLAttributes<HTMLOrSVGElement> {
  name: ICON_NAMES
}

const Icon: FC<Props> = ({ name, ...rest }) => {
  const SelectedIcon: ElementType = useMemo(() => {
    switch (name) {
      case ICON_NAMES.angleLeft:
        return AngleLeftIcon as unknown as ElementType
      case ICON_NAMES.angleRight:
        return AngleRightIcon as unknown as ElementType
      case ICON_NAMES.close:
        return CloseIcon as unknown as ElementType
      case ICON_NAMES.dollarOutline:
        return DollarOutlineIcon as unknown as ElementType
      case ICON_NAMES.globe:
        return GlobeIcon as unknown as ElementType
      case ICON_NAMES.shieldCheck:
        return ShieldCheckIcon as unknown as ElementType
      case ICON_NAMES.fileDock:
        return FileDockIcon as unknown as ElementType
      case ICON_NAMES.star:
        return StarIcon as unknown as ElementType

      default:
        return AngleLeftIcon as unknown as ElementType
    }
  }, [name])

  return <SelectedIcon {...rest} />
}

export default Icon
