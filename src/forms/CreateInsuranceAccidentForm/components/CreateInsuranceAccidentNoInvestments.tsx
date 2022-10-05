import { useNavigate } from "react-router-dom"
import { Dispatch, FC, SetStateAction } from "react"

import { Text } from "theme"
import Confirm from "components/Confirm"

import AppButton from "common/AppButton"

interface Props {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const CreateInsuranceAccidentNoInvestments: FC<Props> = ({ open, setOpen }) => {
  const navigate = useNavigate()

  const onFundListNavigate = () => {
    setOpen(false)
    navigate(`/`)
  }

  return (
    <Confirm title="No investments" isOpen={open} toggle={onFundListNavigate}>
      <Text
        color="#E4F2FF"
        fz={13}
        fw={500}
        block
        align="center"
        p="8px 0 16px"
      >
        You not invested in any fond yet.
      </Text>
      <p></p>
      <button>Choose pool to invest</button>
      <AppButton
        onClick={onFundListNavigate}
        size="large"
        text="Choose pool to invest"
      />
    </Confirm>
  )
}

export default CreateInsuranceAccidentNoInvestments
