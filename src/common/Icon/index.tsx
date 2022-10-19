import {
  AngleLeftIcon,
  AngleLeftOutlinedIcon,
  AngleRightIcon,
  AngleRightOutlinedIcon,
  CloseIcon,
  DollarOutlineIcon,
  ExternalLinkIcon,
  FileDockIcon,
  GlobeIcon,
  ShieldCheckIcon,
  StarIcon,
  UsersIcon,
  ArrowDownFilled,
  ArrowUpFilled,
  ChatOutline,
  Copy,
  GreenCheckIcon,
  TrashIcon,
  CogIcon,
  FacebookIcon,
  LinkedinIcon,
  MediumIcon,
  TelegramIcon,
  TwitterIcon,
} from "assets/icons"

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
      case ICON_NAMES.users:
        return UsersIcon as unknown as ElementType
      case ICON_NAMES.angleLeftOutlined:
        return AngleLeftOutlinedIcon as unknown as ElementType
      case ICON_NAMES.angleRightOutlined:
        return AngleRightOutlinedIcon as unknown as ElementType
      case ICON_NAMES.externalLink:
        return ExternalLinkIcon as unknown as ElementType
      case ICON_NAMES.arrowDownFilled:
        return ArrowUpFilled as unknown as ElementType
      case ICON_NAMES.arrowUpFilled:
        return ArrowDownFilled as unknown as ElementType
      case ICON_NAMES.chatOutline:
        return ChatOutline as unknown as ElementType
      case ICON_NAMES.copy:
        return Copy as unknown as ElementType
      case ICON_NAMES.greenCheck:
        return GreenCheckIcon as unknown as ElementType
      case ICON_NAMES.trash:
        return TrashIcon as unknown as ElementType
      case ICON_NAMES.cog:
        return CogIcon as unknown as ElementType
      case ICON_NAMES.facebook:
        return FacebookIcon as unknown as ElementType
      case ICON_NAMES.linkedin:
        return LinkedinIcon as unknown as ElementType
      case ICON_NAMES.medium:
        return MediumIcon as unknown as ElementType
      case ICON_NAMES.telegram:
        return TelegramIcon as unknown as ElementType
      case ICON_NAMES.twitter:
        return TwitterIcon as unknown as ElementType

      default:
        return AngleLeftIcon as unknown as ElementType
    }
  }, [name])

  return <SelectedIcon {...rest} />
}

export default Icon
