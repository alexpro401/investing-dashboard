import Confirm from "components/Confirm"
import { SubmitState } from "consts/types"
import usePayload from "hooks/usePayload"
import { FC, useCallback } from "react"
import { SpinnerCircularFixed } from "spinners-react"

import { Text } from "./styled"

const Payload: FC = () => {
  const [payload, updatePayload] = usePayload()

  const isModalOpen =
    SubmitState.SIGN === payload || SubmitState.WAIT_CONFIRM === payload

  const toggle = useCallback(() => {
    updatePayload(SubmitState.IDLE)
  }, [updatePayload])

  return (
    <Confirm isOpen={isModalOpen} toggle={toggle} title="Waiting">
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
        {SubmitState.SIGN === payload &&
          "Open your wallet and sign transaction"}
        {SubmitState.WAIT_CONFIRM === payload && "Waiting for confirmation"}
      </Text>
    </Confirm>
  )
}

export default Payload
