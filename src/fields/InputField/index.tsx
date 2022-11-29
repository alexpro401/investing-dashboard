import {
  Dispatch,
  FormEvent,
  HTMLAttributes,
  ReactNode,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react"

import * as S from "./styled"
import { v4 as uuidv4 } from "uuid"
import { Collapse } from "common"
import { useClickAway } from "react-use"

enum INPUT_TYPES {
  text = "text",
  password = "password",
  number = "number",
}

export enum EInputBorderColors {
  success = "success",
  warning = "warning",
}

export interface Props<V extends string | number>
  extends HTMLAttributes<HTMLInputElement> {
  value: V
  setValue?: Dispatch<SetStateAction<V>>
  type?: string
  label?: string
  labelNodeRight?: ReactNode
  placeholder?: string
  errorMessage?: string
  min?: number
  max?: number
  disabled?: string | boolean
  readonly?: string | boolean
  tabindex?: number
  nodeLeft?: ReactNode
  nodeRight?: ReactNode
  borderColor?: EInputBorderColors
  hint?: string
  cRef?: React.MutableRefObject<HTMLDivElement | null>
}

function InputField<V extends string | number>({
  value,
  setValue,
  type = INPUT_TYPES.text,
  label,
  labelNodeRight,
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
  borderColor,
  hint,
  cRef,
  onBlur,
  ...rest
}: Props<V>) {
  const rootEl = useRef<HTMLDivElement | null>(null)

  const uid = useMemo(() => uuidv4(), [])
  const [isFocused, setIsFocused] = useState(false)

  const isNumberType = useMemo(() => type === INPUT_TYPES.number, [type])

  const isDisabled = useMemo(
    () => ["", "disabled", true].includes(disabled as string | boolean),
    [disabled]
  )

  const isReadonly = useMemo(
    () => ["", "readonly", true].includes(readonly as string | boolean),
    [readonly]
  )

  const normalizeNumber = useCallback(
    (_value: string) => {
      return isNaN(Number(_value)) ? value : _value
    },
    [value]
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
        eventTarget.value = normalizeRange(normalizeNumber(eventTarget.value))
      }
      if (value === eventTarget.value) return

      if (setValue) {
        setValue(eventTarget.value as V)
      }

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

  const handleBlur = useCallback(
    (e) => {
      if (onBlur) {
        onBlur(e)
      }
      setIsFocused(false)
    },
    [onBlur]
  )

  useClickAway(rootEl, () => {
    setIsFocused(false)
  })

  return (
    <S.Root
      ref={(node) => {
        rootEl.current = node

        if (cRef) {
          cRef.current = node
        }
      }}
      isReadonly={isReadonly}
      isDisabled={isDisabled}
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      {...rest}
    >
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
          type="text"
          min={min}
          max={max}
          isReadonly={isReadonly}
          disabled={isDisabled || isReadonly}
          isNodeLeftExist={!!nodeLeft}
          isNodeRightExist={!!nodeRight}
          borderColor={borderColor}
          autoComplete="off"
          onBlur={handleBlur}
        />
        {label ? (
          <S.Label
            htmlFor={`input-field--${uid}`}
            isNodeLeftExist={!!nodeLeft}
            isNodeRightExist={!!nodeRight}
            inputId={`input-field--${uid}`}
          >
            {label}
            {!!labelNodeRight ? labelNodeRight : <></>}
          </S.Label>
        ) : (
          <></>
        )}
        {nodeLeft ? <S.NodeLeftWrp>{nodeLeft}</S.NodeLeftWrp> : <></>}
        {nodeRight ? <S.NodeRightWrp>{nodeRight}</S.NodeRightWrp> : <></>}
      </S.InputWrp>
      <Collapse isOpen={!!errorMessage} duration={0.3}>
        <S.ErrorMessage>{errorMessage}</S.ErrorMessage>
      </Collapse>
      <Collapse isOpen={!!hint && isFocused}>
        <S.InputFieldHint>{hint}</S.InputFieldHint>
      </Collapse>
    </S.Root>
  )
}

export default InputField
