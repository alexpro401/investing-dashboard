import styled from "styled-components/macro"
import { RotateSpinner } from "react-spinners-kit"

import { Flex, GradientBorder, respondTo } from "theme"
import insuranceBG from "assets/background/insurance-card.svg"
import dexePlaceholder from "assets/icons/dexe-placeholder.svg"
import { Card } from "common"

const Styled = {
  Container: styled.div<{ loading?: boolean }>`
    position: relative;
  `,
  FeeDateCard: styled(Flex)`
    justify-content: center;
    overflow: hidden;
    position: relative;
    width: 100%;
    padding: 24px 8px;
    margin: 0 0 16px 0;
    border-radius: 20px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.08);
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
    font-family: ${(props) => props.theme.appFontFamily};
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
  MainCard: styled(Card)`
    width: 100%;
    padding: 13px 16px 20px;
    border-radius: 20px;
    flex-direction: column;

    &:after {
      background: #0f1421;
    }

    ${respondTo("xs")} {
      padding: 0;
    }
  `,
  MainCardTitle: styled.div<{ m?: string }>`
    margin: ${(props) => (props.m ? props.m : 0)};
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: 1px;
    color: #e4f2ff;
  `,
  MainCardDescription: styled.div<{ m?: string }>`
    margin: ${(props) => (props.m ? props.m : 0)};
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 15px;
    color: #788ab4;
  `,
  MainCardHeaderRight: styled.div`
    text-align: right;
  `,
  OptimizeWithdrawal: styled(GradientBorder)`
    margin-top: 16px;
    padding: 16px 8px 16px 14px;
    border-radius: 16px;
    align-items: center;
    justify-content: space-between;
    background: transparent;
    width: fill-available;

    &:after {
      background: ${(props) => props.theme.backgroundColors.secondary};
    }
  `,
  OptimizeWithdrawalTitle: styled.div`
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 15px;
    color: #ffffff;
    margin-left: 8px;
  `,
  WithdrawalHistoryTitle: styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 24px auto;
    width: 100%;
    font-family: ${(props) => props.theme.appFontFamily};
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    color: #e4f2ff;
  `,
  WithdrawalHistoryBtn: styled.button`
    background: transparent;
    border: none;
    align-self: center;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 24px;
    color: ${(props) => props.theme.brandColors.secondary};
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
