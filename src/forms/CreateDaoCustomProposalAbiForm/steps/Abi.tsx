import React from "react"
import { useParams } from "react-router-dom"

const AbiStep: React.FC = () => {
  const { daoAddress, executorAddress } = useParams<
    "daoAddress" | "executorAddress"
  >()

  return <p style={{ color: "white" }}>ABI</p>
}

export default AbiStep
