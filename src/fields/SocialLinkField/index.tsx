import { HTMLAttributes, useCallback, ReactNode, useMemo } from "react"

import { Collapse } from "common"
import { ICON_NAMES } from "constants/icon-names"
import { readFromClipboard } from "utils/clipboard"

import * as S from "./styled"

interface ISocialLinkFieldProps<V extends string>
  extends HTMLAttributes<HTMLInputElement> {
  value: V
  setValue?: (value: V) => void
  icon?: ICON_NAMES
  label?: string
  id: string
  errorMessage?: string
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
  readonly = false,
  disabled = false,
  nodeRight,
  ...rest
}: ISocialLinkFieldProps<V>) {
  const handlePasteValue = useCallback(async () => {
    const text = await readFromClipboard()
    if (text && setValue) {
      setValue(text as V)
    }
  }, [setValue])

  const isActive: boolean = useMemo(() => value !== "", [value])

  return (
    <S.Root isDisabled={disabled} isReadonly={readonly} {...rest}>
      <S.InputWrp>
        <S.Input
          id={`input-field--${id}`}
          value={value}
          onWheel={(event) => {
            event.currentTarget.blur()
          }}
          placeholder={" "}
          tabIndex={-1}
          type={"text"}
          disabled={true}
          hasNodeLeft={!!icon && !!label}
          hasNodeRight={!!nodeRight}
          autoComplete="off"
        />
        <S.Label isActive={isActive} empty={isActive && !label}>
          {isActive
            ? label
              ? label[0].toUpperCase() + label.slice(1)
              : ""
            : ""}
        </S.Label>
        {icon && (
          <S.IconWrap>
            <S.Icon name={icon} isActive={isActive} />
          </S.IconWrap>
        )}
        {nodeRight && <S.NodeRightWrap>{nodeRight}</S.NodeRightWrap>}
        <S.Button
          visible={!isActive}
          text={label ? `Paste ${label}` : "Paste other"}
          hasNodeLeft={!!icon && !!label}
          onClick={handlePasteValue}
        />
      </S.InputWrp>
      <Collapse isOpen={!!errorMessage} duration={0.3}>
        <S.ErrorMessage>{errorMessage}</S.ErrorMessage>
      </Collapse>
    </S.Root>
  )
}

export default SocialLinkField
