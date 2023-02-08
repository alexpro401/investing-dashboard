import { ICON_NAMES } from "./icon-names"

export type SUPPORTED_SOCIALS =
  | "facebook"
  | "linkedin"
  | "medium"
  | "telegram"
  | "twitter"
  | "github"
  | "other"

export const SOCIAL_ICONS: Record<SUPPORTED_SOCIALS, ICON_NAMES> = {
  facebook: ICON_NAMES.facebook,
  linkedin: ICON_NAMES.linkedin,
  medium: ICON_NAMES.medium,
  telegram: ICON_NAMES.telegram,
  twitter: ICON_NAMES.twitter,
  github: ICON_NAMES.github,
  other: ICON_NAMES.share,
}
