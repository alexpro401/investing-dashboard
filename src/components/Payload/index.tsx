import Confirm from "components/Confirm"
import { SubmitState } from "constants/types"
import { Dispatch, FC, SetStateAction } from "react"
import { SpinnerCircularFixed } from "spinners-react"

import { Text } from "./styled"

interface Props {
  submitState: SubmitState
  toggle: Dispatch<SetStateAction<SubmitState>>
}

const Payload: FC<Props> = ({ submitState, toggle }) => {
  const isModalOpen =
    SubmitState.SIGN === submitState || SubmitState.WAIT_CONFIRM === submitState

  return (
    <Confirm
      isOpen={isModalOpen}
      toggle={() => toggle(SubmitState.IDLE)}
      title="Waiting"
    >
      <SpinnerCircularFixed
        size={100}
        style={{
          height: 100,
          paddingTop: 38,
        }}
        thickness={46}
        speed={78}
        color="#8DEED3"
        secondaryColor="#0D1320"
      />
      <Text>
        {" "}
        {SubmitState.SIGN === submitState &&
          "Open your wallet and sign transaction"}
        {SubmitState.WAIT_CONFIRM === submitState && "Waiting for confirmation"}
      </Text>
    </Confirm>
  )
}

export default Payload
