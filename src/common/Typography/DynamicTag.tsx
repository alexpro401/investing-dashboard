import { TypographyTags } from "consts/types"
import styled from "styled-components"

export type TypographyProps = {
  tag?: TypographyTags
  children: any

  // Typography props
  size?: string
  desktopSize?: string
  weight?: number
  desktopWeight?: number
}

const StyledDynamicComponent = styled.span``

const DynamicComponent = ({
  tag = "span",
  children,
  ...props
}: TypographyProps) => {
  // Use the withComponent method to change the tag of the styled component
  const WithComponent = StyledDynamicComponent.withComponent(tag)

  return <WithComponent {...props}>{children}</WithComponent>
}

export default DynamicComponent
