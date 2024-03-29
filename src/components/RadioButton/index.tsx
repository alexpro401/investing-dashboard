import { InnerCircle, OuterCircle, Container } from "./styled"
import { FC } from "react"

const RadioButton: FC<{
  selected: string
  onChange: (value: any) => void
  value: string
}> = ({ selected, onChange, value }) => {
  return (
    <Container
      onClick={() => {
        onChange(value)
      }}
    >
      <OuterCircle unselected={value !== selected}>
        <InnerCircle unselected={value !== selected} />
      </OuterCircle>
    </Container>
  )
}

export default RadioButton
