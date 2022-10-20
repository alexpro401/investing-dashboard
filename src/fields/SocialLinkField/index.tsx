import React, {
  HTMLAttributes,
  Dispatch,
  SetStateAction,
  useCallback,
  ReactNode,
  useMemo,
} from "react"

import { Collapse } from "common"
import { ICON_NAMES } from "constants/icon-names"

import * as S from "./styled"

interface ISocialLinkFieldProps<V extends string>
  extends HTMLAttributes<HTMLInputElement> {
  value: V
  setValue?: (value: V) => void
  icon?: ICON_NAMES
  label?: string
  id: string
  errorMessage?: string
  tabindex?: number
  readonly?: boolean
  disabled?: boolean
  nodeRight?: ReactNode
}

function SocialLinkField<V extends string>({
  value,
  setValue,
  id,
  icon,
  label,
  errorMessage,
  tabindex,
  readonly = false,
  disabled = false,
  nodeRight,
  ...rest
}: ISocialLinkFieldProps<V>) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (setValue) {
        setValue(e.currentTarget.value as V)
      }
    },
    [setValue]
  )

  const isActive: boolean = useMemo(() => value !== "", [value])

  return (
    <S.Root isDisabled={disabled} isReadonly={readonly} {...rest}>
      <S.InputWrp>
        {icon && (
          <S.IconWrap>
            <S.Icon name={icon} isActive={isActive} />
          </S.IconWrap>
        )}
        {nodeRight && <S.NodeRightWrap>{nodeRight}</S.NodeRightWrap>}
        <S.Input
          id={`input-field--${id}`}
          value={value}
          onChange={handleChange}
          onWheel={(event) => {
            event.currentTarget.blur()
          }}
          placeholder={" "}
          tabIndex={disabled || readonly ? -1 : tabindex}
          type={"text"}
          disabled={disabled || readonly}
          hasNodeLeft={!!icon && !!label}
          hasNodeRight={!!nodeRight}
          autoComplete="off"
        />
        <S.Label htmlFor={`input-field--${id}`} isActive={isActive}>
          {isActive
            ? label
              ? label[0].toUpperCase() + label.slice(1)
              : ""
            : label
            ? `Paste ${label}`
            : "Paste other"}
        </S.Label>
      </S.InputWrp>
      <Collapse isOpen={!!errorMessage} duration={0.3}>
        <S.ErrorMessage>{errorMessage}</S.ErrorMessage>
      </Collapse>
    </S.Root>
  )
}

export default SocialLinkField
