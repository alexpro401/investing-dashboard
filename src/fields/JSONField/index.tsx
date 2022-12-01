import {
  Dispatch,
  FormEvent,
  HTMLAttributes,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
} from "react"
import { v4 as uuidv4 } from "uuid"
import * as S from "./styled"
import { Collapse } from "common"

interface Props<V extends string | number>
  extends HTMLAttributes<HTMLTextAreaElement> {
  value: V
  setValue: Dispatch<SetStateAction<V>>
  label?: string
  placeholder?: string
  errorMessage?: string
  disabled?: string | boolean
  readonly?: string | boolean
  tabindex?: number
}

function JSONField<V extends string | number>({
  value,
  setValue,
  label,
  placeholder = " ",
  errorMessage,
  disabled,
  readonly,
  tabindex,
  onInput,
  onChange,
  onBlur,
}: Props<V>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const uid = useMemo(() => uuidv4(), [])

  const isDisabled = useMemo(
    () => ["", "disabled", true].includes(disabled as string | boolean),
    [disabled]
  )

  const isReadonly = useMemo(
    () => ["", "readonly", true].includes(readonly as string | boolean),
    [readonly]
  )

  const isToggled = useMemo(() => {
    return !Boolean(value)
  }, [value])

  const handleInput = useCallback(
    (event: FormEvent<HTMLTextAreaElement>) => {
      const eventTarget = event.currentTarget
      if (value === eventTarget.value) return

      setValue(eventTarget.value as V)

      if (onInput) {
        onInput(event)
      }
    },
    [onInput, setValue, value]
  )

  const handleChange = useCallback(
    (event: FormEvent<HTMLTextAreaElement>) => {
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
    },
    [onBlur]
  )

  return (
    <S.Root isReadonly={isReadonly} isDisabled={isDisabled}>
      <S.TextAreaWrp>
        <S.CodeArea id={`text-area-field--${uid}`}>{value}</S.CodeArea>
        {/* <S.TextArea
          ref={textareaRef}
          id={`text-area-field--${uid}`}
          value={value}
          onInput={handleInput}
          onChange={handleChange}
          placeholder={placeholder}
          tabIndex={isDisabled || isReadonly ? -1 : tabindex}
          disabled={isDisabled || isReadonly}
          onBlur={handleBlur}
          // FIXME
          animate={{
            height: "140px",
          }}
          transition={{ duration: 0.05 }}
        /> */}
        {label ? (
          <S.Label
            htmlFor={`text-area-field--${uid}`}
            textareaId={`text-area-field--${uid}`}
          >
            {label}
          </S.Label>
        ) : (
          <></>
        )}
      </S.TextAreaWrp>
      <Collapse isOpen={!!errorMessage} duration={0.3}>
        <S.ErrorMessage>{errorMessage}</S.ErrorMessage>
      </Collapse>
    </S.Root>
  )
}

export default JSONField
