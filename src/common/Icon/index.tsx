import {
  AngleLeftIcon,
  AngleLeftOutlinedIcon,
  AngleRightIcon,
  AngleRightOutlinedIcon,
  AngleUpIcon,
  AngleDownIcon,
  CloseIcon,
  DollarOutlineIcon,
  ExternalLinkIcon,
  FileDockIcon,
  GlobeIcon,
  ShieldCheckIcon,
  StarIcon,
  UserIcon,
  UsersIcon,
  UsersGroupIcon,
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
  WarnIcon,
  ModalCloseIcon,
  SearchIcon,
  ClearIcon,
  WarnCircledIcon,
  GithubIcon,
  CircleWarningIcon,
  CircleInfoIcon,
  SettingsIcon,
  ReloadIcon,
  ShareIcon,
  LockedIcon,
  FlameGradientIcon,
  TileCheckIcon,
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
      case ICON_NAMES.angleUp:
        return AngleUpIcon as unknown as ElementType
      case ICON_NAMES.angleDown:
        return AngleDownIcon as unknown as ElementType
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
      case ICON_NAMES.user:
        return UserIcon as unknown as ElementType
      case ICON_NAMES.users:
        return UsersIcon as unknown as ElementType
      case ICON_NAMES.usersGroup:
        return UsersGroupIcon as unknown as ElementType
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
      case ICON_NAMES.warn:
        return WarnIcon as unknown as ElementType
      case ICON_NAMES.modalClose:
        return ModalCloseIcon as unknown as ElementType
      case ICON_NAMES.search:
        return SearchIcon as unknown as ElementType
      case ICON_NAMES.clear:
        return ClearIcon as unknown as ElementType
      case ICON_NAMES.warnCircled:
        return WarnCircledIcon as unknown as ElementType
      case ICON_NAMES.github:
        return GithubIcon as unknown as ElementType
      case ICON_NAMES.infoCircled:
        return CircleInfoIcon as unknown as ElementType
      case ICON_NAMES.warningCircled:
        return CircleWarningIcon as unknown as ElementType
      case ICON_NAMES.settings:
        return SettingsIcon as unknown as ElementType
      case ICON_NAMES.reload:
        return ReloadIcon as unknown as ElementType
      case ICON_NAMES.share:
        return ShareIcon as unknown as ElementType
      case ICON_NAMES.flameGradient:
        return FlameGradientIcon as unknown as ElementType
      case ICON_NAMES.locked:
        return LockedIcon as unknown as ElementType
      case ICON_NAMES.tileCheck:
        return TileCheckIcon as unknown as ElementType
      default:
        return AngleLeftIcon as unknown as ElementType
    }
  }, [name])

  return <SelectedIcon {...rest} />
}

export default Icon
