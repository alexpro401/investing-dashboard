import styled from "styled-components"
import LogoGradient from "./LogoGradient"

const FloatingWrapper = styled.div`
  position: fixed;
  top: -1;
  left: -1;
  opacity: 0;
  z-index: -1;
  touch-action: none;
  user-select: none;
`

const GlobalGradients = () => (
  <FloatingWrapper>
    <LogoGradient />
  </FloatingWrapper>
)

export default GlobalGradients
