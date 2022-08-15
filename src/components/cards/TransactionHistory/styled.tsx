import styled from "styled-components"

const Styled = {
  Container: styled.div`
    display: grid;
    grid-template-columns: minmax(min-content, 1fr) 115px;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    width: 100%;
    height: 50px;

    &:not(:last-child) {
      border-bottom: 1px solid rgba(26, 33, 46, 0.5);
    }
  `,
  CardIcons: styled.div<{ relative?: boolean }>`
    width: 30px;
    height: 30px;
    position: relative;
    margin-right: 16px;

    ${({ relative = true }) =>
      relative &&
      `& > *:first-child {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 20;
      }
      & > *:last-child {
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 21;
      }`}
  `,
  CardTime: styled.div`
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 15px;

    color: #e4f2ff;
  `,
}
export default Styled
