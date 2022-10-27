import { InputFieldProps } from "fields"

import * as S from "./styled"
import { ICON_NAMES } from "constants/icon-names"
import { SUPPORTED_SOCIALS } from "constants/socials"
import { useCallback, useMemo } from "react"
import { readFromClipboard } from "utils/clipboard"
import { isValidUrl } from "utils"
import { AppButton } from "common"

interface Props<V extends string | number> extends InputFieldProps<V> {
  socialType: SUPPORTED_SOCIALS
  onPaste?: () => void
  onRemove?: () => void
}

function SocialLinkField<V extends string | number>({
  socialType,
  value,
  setValue,
  label,
  placeholder,
  labelNodeRight,
  errorMessage,
  onBlur,
  onPaste,
  onRemove,
  ...rest
}: Props<V>) {
  const iconName = useMemo(() => {
    const iconNamesMap = {
      facebook: ICON_NAMES.facebook,
      linkedin: ICON_NAMES.linkedin,
      medium: ICON_NAMES.medium,
      telegram: ICON_NAMES.telegram,
      twitter: ICON_NAMES.twitter,
      github: ICON_NAMES.github,
      other: "",
    }
    return iconNamesMap[socialType] as ICON_NAMES
  }, [socialType])

  const handlePaste = useCallback(async () => {
    const clipboardValue = await readFromClipboard()

    if (isValidUrl(clipboardValue) && setValue) {
      setValue(clipboardValue as V)
    }

    if (onPaste) {
      onPaste()
    }
  }, [onPaste, setValue])

  const handleRemove = useCallback(() => {
    if (onRemove) {
      onRemove()
    }
  }, [onRemove])

  return (
    <S.Root>
      <S.OverlapInputFieldWrp
        value={value}
        label={value && label}
        labelNodeRight={labelNodeRight}
        placeholder={placeholder}
        onInput={(e) => e.preventDefault()}
        overlapNodeLeft={
          !value ? (
            <S.OverlapPaste>
              <AppButton
                color="default"
                size="no-paddings"
                text={`Paste ${socialType}`}
                iconLeft={iconName}
                onClick={handlePaste}
              />
            </S.OverlapPaste>
          ) : null
        }
        nodeLeft={iconName && value ? <S.InputIcon name={iconName} /> : null}
        nodeRight={value ? <S.RemoveBtn onClick={handleRemove} /> : null}
        errorMessage={errorMessage}
        onBlur={onBlur}
        {...rest}
      />
    </S.Root>
  )
}

export default SocialLinkField
