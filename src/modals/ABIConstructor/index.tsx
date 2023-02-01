import { FC, useEffect, useMemo, useState } from "react"
import Modal from "components/Modal"
import * as S from "./styled"
import RadioButton from "components/RadioButton"
import { AppButton } from "common"
import { InputField } from "fields"
import { replaceAt } from "utils/array"
import { encodeAbiMethod } from "utils/encodeAbi"
import useAlert, { AlertType } from "hooks/useAlert"
import { isArray } from "lodash"

interface Props {
  allowedMethods?: string[]
  abi: string
  isOpen: boolean
  onClose: () => void
  onSubmit: (method: string, encodedData: string) => void
}

const ABIConstructor: FC<Props> = ({
  abi,
  allowedMethods = [],
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selectedMethod, setSelectedMethod] = useState("")
  const [selectedMethodInputs, setSelectedMethodInputs] = useState<any[]>([])
  const [isParseError, setParseError] = useState(false)
  const [alert] = useAlert()

  const handleInputChange = (index: number, value: string) => {
    setSelectedMethodInputs((prev) => replaceAt([...prev], index, value))
  }

  const handleSubmit = () => {
    setParseError(false)
    try {
      const encodedMethodCall = encodeAbiMethod(
        abi,
        selectedMethod,
        selectedMethodInputs
      )
      onSubmit(selectedMethod, encodedMethodCall)
    } catch (e: any) {
      const error: string = e.message
      setParseError(true)

      alert({
        type: AlertType.warning,
        content: error.slice(0, error.indexOf("(")),
      })
    }
  }

  const filteredWritableMethods = useMemo(() => {
    try {
      const abiParsed = JSON.parse(abi)

      if (!isArray(abiParsed)) return []

      if (allowedMethods.length) {
        return abiParsed.filter((method) => {
          return (
            method.type === "function" &&
            method.stateMutability !== "view" &&
            allowedMethods.includes(method.name)
          )
        })
      }

      return abiParsed.filter(
        (item) => item.type === "function" && item.stateMutability !== "view"
      )
    } catch {
      return []
    }
  }, [abi, allowedMethods])

  // reset state on method change
  useEffect(() => {
    setSelectedMethodInputs([])
    setParseError(false)
  }, [selectedMethod])

  return (
    <Modal
      maxWidth="fit-content"
      isOpen={isOpen}
      onClose={onClose}
      title={"Choose method: " + filteredWritableMethods.length}
    >
      <S.Container>
        <S.List>
          {!filteredWritableMethods.length && (
            <S.ErrorContainer>
              No methods found from provided ABI
            </S.ErrorContainer>
          )}
          {filteredWritableMethods.map((item) => (
            <S.Card
              key={item.name}
              onClick={() => setSelectedMethod(item.name)}
            >
              <S.Head>
                <RadioButton
                  selected={selectedMethod}
                  value={item.name}
                  onChange={() => {}}
                />
                <S.Title>{item.name}</S.Title>
              </S.Head>
              {item.name === selectedMethod && !!item.inputs.length && (
                <S.Body
                  initial={{
                    height: 0,
                  }}
                  animate={{
                    height: "auto",
                  }}
                >
                  {item.inputs.map((input, index) => (
                    <InputField
                      setValue={(value) => handleInputChange(index, value)}
                      type={input.type === "uint256" ? "number" : undefined}
                      placeholder={`${input.name} (${input.type})`}
                      key={input.name}
                      value={selectedMethodInputs[index]}
                    />
                  ))}
                </S.Body>
              )}
            </S.Card>
          ))}
        </S.List>
        <S.Footer>
          <AppButton
            style={{ width: "100%" }}
            disabled={!selectedMethod}
            onClick={handleSubmit}
            size="large"
            color={isParseError ? "error" : "primary"}
            text={isParseError ? "Try again" : "Confirm"}
          />
        </S.Footer>
      </S.Container>
    </Modal>
  )
}

export default ABIConstructor
