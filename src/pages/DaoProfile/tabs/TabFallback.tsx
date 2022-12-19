import React from "react"

import { GuardSpinner } from "react-spinners-kit"
import { Flex } from "theme"

const TabFallback: React.FC = () => {
  return (
    <div style={{ width: "100%", height: "50vh" }}>
      <Flex full ai={"flex-start"} jc={"center"}>
        <GuardSpinner size={20} loading />
      </Flex>
    </div>
  )
}

export default TabFallback
