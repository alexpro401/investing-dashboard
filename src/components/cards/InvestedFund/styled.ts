import styled from "styled-components/macro"

export const Container = styled.div`
  width: 100%;
  height: 60px;
  padding: 9px 16px 11px;
`

export const Content = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr minmax(20%, 25%) 17%;
  grid-gap: 18px;
  align-items: center;
`

export const Icons = styled.div`
  width: 40px;
  height: 40px;
  position: relative;
  margin-right: 9px;

  & > :nth-child(1) {
    position: relative;
    z-index: 1;
  }
  & > :nth-child(2) {
    position: absolute;
    right: -5px;
    bottom: 0;
    z-index: 2;
  }
`
