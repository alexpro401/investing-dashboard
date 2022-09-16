import {
  Dispatch,
  FormEvent,
  HTMLAttributes,
  ReactNode,
  SetStateAction,
  useCallback,
  useMemo,
} from "react"

import * as S from "./styled"
import { v4 as uuidv4 } from "uuid"
import { AnimatePresence } from "framer-motion"

enum INPUT_TYPES {
  text = "text",
  password = "password",
  number = "number",
}

interface Props<V extends string | number>
  extends HTMLAttributes<HTMLInputElement> {
  value: V
  setValue: Dispatch<SetStateAction<V>>
  type?: string
  label?: string
  placeholder?: string
  errorMessage?: string
  min?: number
  max?: number
  disabled?: string | boolean
  readonly?: string | boolean
  tabindex?: number
  nodeLeft?: ReactNode
  nodeRight?: ReactNode
}

function InputField<V extends string | number>({
  value,
  setValue,
  type = INPUT_TYPES.text,
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
  ...rest
}: Props<V>) {
  const uid = useMemo(() => uuidv4(), [])

  const isNumberType = useMemo(() => type === INPUT_TYPES.number, [type])

  const isPasswordType = useMemo(() => type === INPUT_TYPES.password, [type])

  const isDisabled = useMemo(
    () => ["", "disabled", true].includes(disabled as string | boolean),
    [disabled]
  )

  const isReadonly = useMemo(
    () => ["", "readonly", true].includes(readonly as string | boolean),
    [readonly]
  )

  const normalizeRange = useCallback(
    (value: string | number): string => {
      let result = value

      if (min && value < min) {
        result = min
      }
      if (max && value > max) {
        result = max
      }

      return result as string
    },
    [max, min]
  )

  const handleInput = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      const eventTarget = event.currentTarget
      if (isNumberType) {
        eventTarget.value = normalizeRange(eventTarget.value)
      }
      if (value === eventTarget.value) return

      setValue(eventTarget.value as V)

      if (onInput) {
        onInput(event)
      }
    },
    [isNumberType, normalizeRange, onInput, setValue, value]
  )

  const handleChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event)
      }
    },
    [onChange]
  )

  return (
    <S.Root isReadonly={isReadonly} isDisabled={isDisabled} {...rest}>
      <S.InputWrp>
        <S.Input
          id={`input-field--${uid}`}
          value={value}
          onInput={handleInput}
          onChange={handleChange}
          onWheel={(event) => {
            event.currentTarget.blur()
          }}
          placeholder={placeholder}
          tabIndex={isDisabled || isReadonly ? -1 : tabindex}
          type={type}
          min={min}
          max={max}
          disabled={isDisabled || isReadonly}
          isError={!!errorMessage}
          isNodeLeftExist={!!nodeLeft}
          isNodeRightExist={!!nodeRight}
        />
        {label ? (
          <S.Label
            htmlFor={`input-field--${uid}`}
            isError={!!errorMessage}
            isNodeLeftExist={!!nodeLeft}
            isNodeRightExist={!!nodeRight}
          >
            {label}
          </S.Label>
        ) : (
          <></>
        )}
        {nodeLeft ? <S.NodeLeftWrp>{nodeLeft}</S.NodeLeftWrp> : <></>}
        {nodeRight ? <S.NodeRightWrp>{nodeRight}</S.NodeRightWrp> : <></>}
      </S.InputWrp>
      <AnimatePresence>
        {errorMessage ? <S.ErrorMessage>{errorMessage}</S.ErrorMessage> : <></>}
      </AnimatePresence>
    </S.Root>
  )
}

export default InputField
