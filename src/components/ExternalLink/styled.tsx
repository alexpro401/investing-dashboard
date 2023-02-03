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
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.85714 4H4.57143C4.25584 4 4 4.25584 4 4.57143V11.4286C4 11.7442 4.25584 12 4.57143 12H11.4286C11.7442 12 12 11.7442 12 11.4286V9.14286"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.6663 6.66536L12.6663 3.33203H9.33301"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.66699 7.33333L12.0003 4"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconContainer>
  )
}
