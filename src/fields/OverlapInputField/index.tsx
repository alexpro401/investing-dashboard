import { ReactNode } from "react"

import { InputField, InputFieldProps } from "fields"

import * as S from "./styled"

interface Props<V extends string | number> extends InputFieldProps<V> {
  overlapNodeLeft?: ReactNode
  overlapNodeRight?: ReactNode
}

function OverlapInputField<V extends string | number>({
  value,
  setValue,
  label,
  placeholder = " ",
  errorMessage,
  min,
  max,
  disabled,
  readonly,
  tabindex,
  onInput,
  onChange,
  nodeLeft,
  nodeRight,
  overlapNodeLeft,
  overlapNodeRight,
  onBlur,
  cRef,
  ...rest
}: Props<V>) {
  return (
    <S.Root isOverlapping={!!overlapNodeLeft || !!overlapNodeRight} {...rest}>
      <InputField
        value={value}
        setValue={setValue}
        label={label}
        placeholder={placeholder}
        errorMessage={errorMessage}
        min={min}
        max={max}
        disabled={disabled}
        readonly={readonly}
        tabindex={tabindex}
        onInput={onInput}
        onChange={onChange}
        nodeLeft={nodeLeft}
        nodeRight={!overlapNodeRight && nodeRight}
        onBlur={onBlur}
        cRef={cRef}
      />
      {overlapNodeLeft ? (
        <S.OverlapNodeLeft>{overlapNodeLeft}</S.OverlapNodeLeft>
      ) : (
        <></>
      )}
      {overlapNodeRight ? (
        <S.OverlapNodeRight>{overlapNodeRight}</S.OverlapNodeRight>
      ) : (
        <></>
      )}
    </S.Root>
  )
}

export default OverlapInputField
