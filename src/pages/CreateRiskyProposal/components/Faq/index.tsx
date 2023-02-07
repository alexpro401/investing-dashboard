import { useCallback, useState } from "react"
import { AppButton, Icon } from "common"
import Checkbox from "components/Checkbox"
import { ICON_NAMES } from "consts"
import { Flex } from "theme"
import FaqText from "./content"
import * as S from "./styled"

const Faq = () => {
  const [isChecked, setChecked] = useState(false)

  const handleCheckboxChange = useCallback(() => {
    setChecked(!isChecked)

    if (!isChecked) {
      localStorage.setItem("risky-proposal-faq-read", "true")
    } else {
      localStorage.setItem("risky-proposal-faq-read", "false")
    }
  }, [isChecked])

  return (
    <S.Container>
      <S.Header>
        <S.Title>How a risky proposal works ?</S.Title>
        <Icon name={ICON_NAMES.modalClose} />
      </S.Header>
      <S.Body>{FaqText}</S.Body>
      <S.Footer>
        <Flex full jc="flex-start" p="16px 16px 0">
          <Checkbox
            label={
              <S.CheckboxLabel>
                Don&apos;t show me this message again
              </S.CheckboxLabel>
            }
            name="dont-show-risky-proposal-faq"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
        </Flex>
        <S.Buttons>
          <AppButton text="Return" size="small" color="secondary" full />
          <AppButton text="Continue" size="small" color="primary" full />
        </S.Buttons>
      </S.Footer>
    </S.Container>
  )
}

export default Faq
