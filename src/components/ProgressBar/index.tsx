import { CircularProgressbarWithChildren } from "react-circular-progressbar"
import "./custom.css"

import styled from "styled-components"

const Container = styled.div`
  height: 110px;
  width: 110px;
`

const Label = styled.div`
  font-family: Gilroy;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  color: #c5d1dc;
`

const Value = styled.div`
  font-family: Gilroy;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  text-align: center;

  color: #5a6071;
`

const ProgressBar: React.FC<{
  label: string
  value: string
  percent: number
}> = ({ label, value, percent }) => {
  return (
    <Container>
      <CircularProgressbarWithChildren value={percent}>
        <Label>{label}</Label>
        <Value>{value}</Value>
      </CircularProgressbarWithChildren>
    </Container>
  )
}

export default ProgressBar
