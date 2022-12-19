import styled from "styled-components"
import { AppButton } from "common"

export const Root = styled.div`
  display: flex;
  flex-direction: column;
`

export const StepsNavigationProgress = styled.div<{ progress: number }>`
  position: relative;
  width: 100%;
  height: 1px;
  background: #293c54;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: ${(props) => props.progress}%;
    height: 1px;
    background: ${(props) => props.theme.statusColors.success};
  }
`

export const StepsNavigationActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (min-width: 768px) {
    justify-content: flex-end;
    padding: 0 20px;
  }
`

export const StepsNavigationButton = styled(AppButton)<{
  isActive?: boolean
}>`
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  color: ${(props) =>
    props.isActive
      ? props.theme.statusColors.success
      : props.theme.textColors.secondary};

  @media screen and (min-width: 768px) {
    min-width: 280px;
    border-width: 0;
  }
`
