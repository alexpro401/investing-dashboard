import {
  AngleDownIcon,
  AngleLeftIcon,
  AngleLeftOutlinedIcon,
  AngleRightIcon,
  AngleRightOutlinedIcon,
  AngleUpIcon,
  ArrowDownDiagonalIcon,
  ArrowDownFilled,
  ArrowIcon,
  ArrowUpDiagonalIcon,
  ArrowUpFilled,
  BSCIcon,
  ChatOutline,
  CircleInfoIcon,
  CircleWarningIcon,
  ClearIcon,
  ClockCircledIcon,
  CloseIcon,
  CogIcon,
  Copy,
  DexeTokenIcon,
  DollarOutlineIcon,
  ExclamationCircle,
  ExternalLinkIcon,
  FacebookIcon,
  FileDockIcon,
  FlameGradientIcon,
  GithubIcon,
  GlobeIcon,
  GradientCheckIcon,
  GreenCheckIcon,
  InsuranceIcon,
  InsuranceMultiplierIcon,
  LinkedinIcon,
  LockedIcon,
  LogoIcon,
  LogoutIcon,
  MediumIcon,
  MetamaskIcon,
  ModalCloseIcon,
  PlusIcon,
  ReloadIcon,
  SearchIcon,
  SettingsIcon,
  ShareIcon,
  ShieldCheckIcon,
  StarIcon,
  SuccessCircledIcon,
  TelegramIcon,
  TileCheckIcon,
  TrashIcon,
  TwitterIcon,
  UnknownTokenIcon,
  UserIcon,
  UsersGroupIcon,
  UsersIcon,
  WarnCircledIcon,
  WarnIcon,
} from "assets/icons"

import { ElementType, FC, HTMLAttributes, useMemo } from "react"
import { ICON_NAMES } from "consts/icon-names"

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
      case ICON_NAMES.arrow:
        return ArrowIcon as unknown as ElementType
      case ICON_NAMES.metamask:
        return MetamaskIcon as unknown as ElementType
      case ICON_NAMES.plus:
        return PlusIcon as unknown as ElementType
      case ICON_NAMES.exclamationCircle:
        return ExclamationCircle as unknown as ElementType
      case ICON_NAMES.clockCircle:
        return ClockCircledIcon as unknown as ElementType
      case ICON_NAMES.successCircle:
        return SuccessCircledIcon as unknown as ElementType
      case ICON_NAMES.insuranceMultiplier:
        return InsuranceMultiplierIcon as unknown as ElementType
      case ICON_NAMES.unknownToken:
        return UnknownTokenIcon as unknown as ElementType
      case ICON_NAMES.logoIcon:
        return LogoIcon as unknown as ElementType
      case ICON_NAMES.dexeTokenIcon:
        return DexeTokenIcon as unknown as ElementType
      case ICON_NAMES.gradientCheck:
        return GradientCheckIcon as unknown as ElementType
      case ICON_NAMES.logout:
        return LogoutIcon as unknown as ElementType
      case ICON_NAMES.arrowUpDiagonal:
        return ArrowUpDiagonalIcon as unknown as ElementType
      case ICON_NAMES.arrowDownDiagonal:
        return ArrowDownDiagonalIcon as unknown as ElementType
      case ICON_NAMES.bsc:
        return BSCIcon as unknown as ElementType
      case ICON_NAMES.insurance:
        return InsuranceIcon as unknown as ElementType
      default:
        return AngleLeftIcon as unknown as ElementType
    }
  }, [name])

  return <SelectedIcon {...rest} />
}

export default Icon
