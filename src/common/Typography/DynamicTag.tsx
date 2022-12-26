import { TypographyTags } from "constants/types"
import styled from "styled-components"

type Props = {
  // The HTML tag to render, with a default of 'span'
  tag?: TypographyTags
  children: any
}

const StyledDynamicComponent = styled.span``

const DynamicComponent = ({ tag = "span", children, ...props }: Props) => {
  // Use the withComponent method to change the tag of the styled component
  const WithComponent = StyledDynamicComponent.withComponent(tag)

  return <WithComponent {...props}>{children}</WithComponent>
}

export default DynamicComponent
