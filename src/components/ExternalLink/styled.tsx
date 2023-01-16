import styled from "styled-components/macro"

export const Container = styled.a<{ color: string; fw?: string; fz?: string }>`
  color: ${({ color }) => color ?? "white"};

  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: ${({ fw }) => fw ?? "400"};
  font-size: ${({ fz }) => fz ?? "12px"};
  line-height: ${({ fz }) => fz ?? "12px"};
  letter-spacing: 0.03em;

  text-decoration: none;
  white-space: nowrap;
`

export const Text = styled.span<{
  iconPosition: string
  removeIcon: boolean
}>`
  display: inline-block;
  color: inherit;
  order: ${({ iconPosition }) => (iconPosition === "right" ? "0" : "1")};
  margin-top: ${({ removeIcon }) => (removeIcon ? 0 : "3px")};
`

export const IconContainer = styled.div<{
  iconPosition: string
  iconSize: string
}>`
  display: inline-block;
  order: ${({ iconPosition }) => (iconPosition === "right" ? "1" : "0")};
  width: ${({ iconSize }) => iconSize ?? "15px"};
  height: ${({ iconSize }) => iconSize ?? "15px"};
  transform: translateY(3px);

  svg {
    width: inherit;
    height: inherit;
  }
`

export const BaseIcon = ({ color, iconPosition, iconSize }) => {
  return (
    <IconContainer iconPosition={iconPosition} iconSize={iconSize}>
      <svg viewBox="0 0 20 20" fill="none">
        <path
          d="M8.57143 3.83594H5.71429C5.3198 3.83594 5 4.15573 5 4.55022V13.1217C5 13.5161 5.3198 13.8359 5.71429 13.8359H14.2857C14.6802 13.8359 15 13.5161 15 13.1217V10.2645"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.8327 7.16667L15.8327 3H11.666"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.834 8.0026L15.0007 3.83594"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconContainer>
  )
}
