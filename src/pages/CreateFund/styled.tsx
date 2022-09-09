import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  background-color: #040a0f;
  width: fill-available;
  height: calc(100vh - 94px);
  overflow-y: auto;

  @media all and (display-mode: standalone) {
    height: calc(100vh - 115px);
  }
`

export const FundTypeCards = styled.div`
  padding: 0 16px;
`

export const FundTypeCardsTitle = styled.h3`
  font-size: 16px;
  line-height: 1.2;
  color: #e4f2ff;
  font-weight: 700;
`

export const CreateFundDocsBlock = styled.div`
  background: #141926;
  border-radius: 20px;
`
