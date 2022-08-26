import { useCallback, useMemo, useState } from "react"

import { useUserAgreement } from "state/user/hooks"

import Modal from "components/Modal"
import Checkbox from "components/Checkbox"
import Button, { SecondaryButton } from "components/Button"

import {
  ModalText,
  CheckBoxContent,
  CheckboxText,
  CheckboxLink,
  ButtonContainer,
} from "./styled"

interface Props {}

const TermsAgreement: React.FC<Props> = () => {
  const [{ processed, showAgreement }, { setShowAgreement, onAgree }] =
    useUserAgreement()

  const toggleView = useCallback(() => {
    setShowAgreement(!showAgreement)
  }, [setShowAgreement, showAgreement])

  const [agree, setAgree] = useState(false)

  const handleCheckbox = (value) => {
    setAgree(value)
  }

  const button = useMemo(() => {
    if (agree && !processed) {
      return (
        <Button full onClick={onAgree}>
          Sing and proceed
        </Button>
      )
    }

    return (
      <SecondaryButton full disabled>
        Sing and proceed
      </SecondaryButton>
    )
  }, [agree, processed, onAgree])

  return (
    <Modal
      title="Terms & Conditions agreement"
      isOpen={showAgreement}
      toggle={toggleView}
    >
      <ModalText>
        <ul>
          <li>
            Lorem ipsum dolor sit amet, his cu zril habemus. Ex cum nostrud
            feugiat, cu duo affert discere facilisis.
          </li>
          <li>
            Te nec adolescens vituperata referrentur, summo minimum oportere pri
            ut.
          </li>
          <li>
            Impedit necessitatibus ne vix, doming disputando his et. Falli
            expetenda voluptatibus at sea. Meis habeo cu pri, nam ne solet
            possit torquatos, et mei nobis invenire. Falli expetenda
            voluptatibus at sea. Meis habeo cu pri, nam ne solet possit
            torquatos, et mei nobis invenire.
          </li>
          <li>
            Cum cu porro temporibus delicatissimi. Diceret singulis ut mei, ut
            lorem singulis vim. Ut eam mutat novum appareat, ei vel quot saepe
            animal.
          </li>
          <li>
            Impedit necessitatibus ne vix, doming disputando his et. Falli
            expetenda voluptatibus at sea. Meis habeo cu pri, nam ne solet
            possit torquatos, et mei nobis invenire. Falli expetenda
            voluptatibus at sea. Meis habeo cu pri, nam ne solet possit
            torquatos, et mei nobis invenire.
          </li>
        </ul>
      </ModalText>
      <CheckBoxContent>
        <Checkbox
          name="agree-terms"
          checked={agree}
          onChange={handleCheckbox}
        />
        <CheckboxText>
          I agree to the
          <CheckboxLink>
            <span> Terms of Use </span>
          </CheckboxLink>
          and
          <CheckboxLink>
            <span> Privacy Police</span>
          </CheckboxLink>
        </CheckboxText>
      </CheckBoxContent>
      <ButtonContainer>{button}</ButtonContainer>
    </Modal>
  )
}

export default TermsAgreement
