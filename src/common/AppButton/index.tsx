import { AnchorHTMLAttributes, HTMLAttributes, ReactNode, useMemo } from "react"
import { LinkProps } from "react-router-dom"

import * as S from "./styled"

import { ICON_NAMES } from "constants/icon-names"

export type SCHEMES = "filled" | "flat"

export enum MODIFICATIONS {
  borderRounded = "border-rounded",
}

export type COLORS =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "default"

export type SIZES = "large" | "medium" | "small" | "x-small" | "no-paddings"

type Props<R extends string, H extends string> = {
  iconLeft?: ICON_NAMES | ReactNode
  iconRight?: ICON_NAMES | ReactNode
  iconSize?: number
  text?: string
  scheme?: SCHEMES
  size?: SIZES
  color?: COLORS
  modifications?: string
  href?: H
  routePath?: R
  disabled?: boolean
  full?: boolean
} & (R extends string
  ? Omit<LinkProps, "to">
  : H extends string
  ? AnchorHTMLAttributes<HTMLAnchorElement>
  : HTMLAttributes<HTMLButtonElement>)

const AppButton = <R extends string, H extends string>({
  iconLeft,
  iconRight,
  iconSize,
  text,
  scheme = "filled",
  modifications = MODIFICATIONS.borderRounded,
  size = "medium",
  color = "primary",
  href,
  routePath,
  disabled,
  full,
  children,
  ...rest
}: Props<R, H>) => {
  const isDisabled: boolean = useMemo(
    () => ["", "disabled", true].includes(disabled as string | boolean),
    [disabled]
  )

  const btnModifications = useMemo(
    () => modifications?.split(" ").filter((el: string) => Boolean(el)),
    [modifications]
  )

  const btnStates = useMemo(
    () => [...(isDisabled ? ["disabled"] : [])],
    [isDisabled]
  )

  const leftIcon = useMemo(() => {
    if (!iconLeft) return <></>

    if (Object.values(ICON_NAMES).includes(iconLeft as ICON_NAMES)) {
      return <S.AppButtonIcon name={iconLeft as ICON_NAMES} size={iconSize} />
    }

    return iconLeft
  }, [iconLeft, iconSize])

  const rightIcon = useMemo(() => {
    if (!iconRight) return <></>

    if (Object.values(ICON_NAMES).includes(iconRight as ICON_NAMES)) {
      return <S.AppButtonIcon name={iconRight as ICON_NAMES} size={iconSize} />
    }

    return iconRight
  }, [iconRight, iconSize])

  const ButtonInner = (
    <>
      {leftIcon}
      {children || text ? <S.AppButtonText>{text}</S.AppButtonText> : <></>}
      {rightIcon}
    </>
  )

  if (routePath) {
    return (
      <S.NavLinkType
        scheme={scheme}
        modifications={btnModifications}
        states={btnStates}
        size={size}
        coloring={color}
        {...(rest as LinkProps)}
        to={routePath}
      >
        {ButtonInner}
      </S.NavLinkType>
    )
  } else if (href) {
    return (
      <S.HrefType
        scheme={scheme}
        modifications={btnModifications}
        states={btnStates}
        size={size}
        coloring={color}
        href={href}
        {...(rest as HTMLAttributes<HTMLAnchorElement>)}
      >
        {ButtonInner}
      </S.HrefType>
    )
  }

  return (
    <S.ButtonType
      full={full}
      scheme={scheme}
      modifications={btnModifications}
      states={btnStates}
      size={size}
      coloring={color}
      disabled={isDisabled}
      {...(rest as HTMLAttributes<HTMLButtonElement>)}
    >
      {ButtonInner}
    </S.ButtonType>
  )
}

export default AppButton
