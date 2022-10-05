import theme from "../theme"

export const fieldBg = theme.backgroundColors.secondary

export const fieldLabelColor = "#788AB4"
export const fieldLabelHoverColor = "#B1C7FC"
export const fieldLabelFocusColor = "#B1C7FC"
export const fieldLabelFontSize = 13
export const fieldLabelFocusFontSize = 16
export const fieldLabelLineHeight = 1.2

export const fieldTextColor = "#E4F2FF"
export const fieldTextFontSize = 16
export const fieldTextLineHeight = 1
export const fieldPlaceholderColor = "#788AB4"

export const fieldTransitionDuration = 0.3

export const fieldPaddingTop = 17.5
export const fieldPaddingRight = 16
export const fieldPaddingBottom = 17.5
export const fieldPaddingLeft = 16
export const fieldPaddings = `${fieldPaddingTop}px ${fieldPaddingRight}px ${fieldPaddingBottom}px ${fieldPaddingLeft}px`

export const fieldErrorColor = "#ff0000"

export const getDefaultFieldLabelStyles = () => {
  return `
    font-size: ${fieldLabelFocusFontSize}px;
    line-height: ${fieldLabelLineHeight};
    color: ${fieldLabelFocusColor};
    transition: ${fieldTransitionDuration}s ease;
  `
}

export const getDefaultFieldTextStyles = () => {
  return `
    font-size: ${fieldTextFontSize}px;
    line-height: ${fieldTextLineHeight};
    -webkit-text-fill-color: ${fieldTextColor};
    color: ${fieldTextColor};
    transition: color ${fieldTransitionDuration}s ease;
    font-weight: 500;
  `
}

export const getDefaultFieldBorderStyles = () => {
  return `
    border: 1px solid ${"#293C54"};
    border-radius: 16px;
  `
}

export const getDefaultFieldPlaceholderStyles = () => {
  return `
    color: ${fieldPlaceholderColor};
    -webkit-text-fill-color: ${fieldPlaceholderColor};
    fill: ${fieldPlaceholderColor};
    transition: ${fieldTransitionDuration}s ease;
    transition-property: opacity, color;
  `
}

export const getDefaultFieldErrorStyles = () => {
  return `
    overflow: hidden;
    color: ${fieldErrorColor};
    font-size: 10px;
    line-height: 1.4;
    transition: ${fieldTransitionDuration} ease;
    transition-property: opacity, color, font-size, transform;
    margin-top: 4px;
  `
}
