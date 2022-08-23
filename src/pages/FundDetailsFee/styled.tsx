import styled from "styled-components"
import { RotateSpinner } from "react-spinners-kit"

import { Flex, GradientBorder } from "theme"
import insuranceBG from "assets/background/insurance-card.svg"
import dexePlaceholder from "assets/icons/dexe-placeholder.svg"

const Styled = {
  Container: styled.div<{ loading?: boolean }>`
    position: relative;
    padding: 16px;
    width: fill-available;
    background: #0e121b;

    height: ${({ loading = false }) =>
      loading ? "calc(100vh - 128px)" : "initial"};

    @media all and (display-mode: standalone) {
      height: ${({ loading = false }) =>
        loading ? "calc(100vh - 149px)" : "initial"};
    }
  `,
  FeeDateCard: styled(Flex)`
    justify-content: center;
    overflow: hidden;
    position: relative;
    width: 100%;
    padding: 24px 8px;
    margin: 0 0 16px 0;
    border-radius: 20px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08);
    border: 1px solid #2f3c3a;

    z-index: 5;

    &:before {
      content: "";
      z-index: 4;
      height: 100%;
      position: absolute;
      left: 0;
      right: 0;
      bottom: -8px;
      background: url(${insuranceBG});
      background-repeat: no-repeat;
    }
    &:after {
      content: "";
      z-index: 4;
      height: 79px;
      width: 79px;
      position: absolute;
      top: -6px;
      left: -6px;
      background: url(${dexePlaceholder});
      background-repeat: no-repeat;
    }
  `,
  FeeDateText: styled.div`
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 15px;
    color: #e4f2ff;
    letter-spacing: -0.3px;
  `,
  LoadingContent: styled(Flex)`
    height: inherit;
  `,
  MainCard: styled(GradientBorder)`
    width: 100%;
    padding: 13px 16px 20px;
    border-radius: 20px;
    flex-direction: column;

    &:after {
      background: #0f1421;
    }
  `,
  MainCardTitle: styled.div<{ m?: string }>`
    margin: ${(props) => (props.m ? props.m : 0)};
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: 1px;
    color: #e4f2ff;
  `,
  MainCardDescription: styled.div<{ m?: string }>`
    margin: ${(props) => (props.m ? props.m : 0)};
    font-family: "Gilroy";
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 15px;
    color: #788ab4;
  `,
  MainCardHeaderRight: styled.div`
    text-align: right;
  `,
}

export default Styled

export const PageLoading = () => (
  <Styled.Container loading>
    <Styled.LoadingContent full ai="center" jc="center" m="auto">
      <RotateSpinner />
    </Styled.LoadingContent>
  </Styled.Container>
)
