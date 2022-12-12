import styled from "styled-components"

export const Container = styled.div`
  margin: 0 auto;
  background-color: #040a0f;
  width: fill-available;
  overflow-y: auto;
`

export const Body = styled.div`
  box-sizing: border-box;
  padding: 20px;
`

export const Paragraph = styled.div`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.03em;
  color: #bbccdb;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
`
