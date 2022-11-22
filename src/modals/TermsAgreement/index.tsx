import { useCallback, useMemo, useState } from "react"

import { useUserAgreement } from "state/user/hooks"

import Modal from "components/Modal"
import Checkbox from "components/Checkbox"
import { AppButton } from "common"

import S from "./styled"

interface Props {}

const TermsAgreement: React.FC<Props> = () => {
  const [{ showAgreement }, { setShowAgreement, onAgree }] = useUserAgreement()

  const toggleView = useCallback(() => {
    setShowAgreement(!showAgreement)
  }, [setShowAgreement, showAgreement])

  const [agree, setAgree] = useState(false)

  const handleCheckbox = (value) => {
    setAgree(value)
  }

  const button = useMemo(() => {
    return (
      <AppButton
        disabled={!agree}
        color={agree ? "primary" : "secondary"}
        size="medium"
        full
        onClick={onAgree}
        text="Sing and proceed"
      />
    )
  }, [agree, onAgree])

  return (
    <Modal
      title="Terms & Conditions agreement"
      isOpen={showAgreement}
      toggle={toggleView}
    >
      <S.Text>
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
      </S.Text>
      <S.CheckboxContainer>
        <Checkbox
          name="agree-terms"
          checked={agree}
          onChange={handleCheckbox}
          label={
            <S.CheckboxText>
              I agree to the
              <S.CheckboxLink>
                <span> Terms of Use </span>
              </S.CheckboxLink>
              and
              <S.CheckboxLink>
                <span> Privacy Police </span>
              </S.CheckboxLink>
            </S.CheckboxText>
          }
        />
      </S.CheckboxContainer>
      <S.ButtonContainer>{button}</S.ButtonContainer>
    </Modal>
  )
}

export default TermsAgreement
