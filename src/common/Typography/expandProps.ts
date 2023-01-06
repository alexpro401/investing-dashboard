import { respondTo } from "theme"
import { TypographyProps } from "./DynamicTag"

const expandTypographyWithProps = (props: TypographyProps) => `
    ${props.color ? `color: ${props.color};` : ""}

    ${props.size ? `font-size: ${props.size};` : ""}
    ${props.weight ? `font-weight: ${props.weight};` : ""}

    ${respondTo("sm")} {
        ${props.desktopSize ? `font-size: ${props.desktopSize};` : ""}
        ${props.desktopWeight ? `font-weight: ${props.desktopWeight};` : ""}
    }
`

export default expandTypographyWithProps
