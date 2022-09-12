import styled from "styled-components"

export const Container = styled.div`
  margin: 0 auto;
  background-color: #040a0f;
  width: fill-available;
  height: calc(100vh - 94px);
  overflow-y: auto;

  @media all and (display-mode: standalone) {
    height: calc(100vh - 115px);
  }
`

export const CreateDaoCard = styled.div`
  display: flex;
  flex-direction: column;
  background: #181e2c;
  border-radius: 20px;
  padding: 16px;
  gap: 12px;
`

export const CreateDaoCardTitle = styled.span`
  font-size: 16px;
  line-height: 1.2;
  font-weight: 700;
  color: #e4f2ff;
  margin: 0;
  vertical-align: middle;
`

export const CreateDaoCardNumberIcon = styled.div`
  position: relative;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid #7fffd4;
`

export const CreateDaoCardNumberIconText = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #7fffd4;
  font-size: 12px;
  line-height: 1.2;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
`

export const CreateDaoCardDescription = styled.div`
  font-size: 12px;
  line-height: 1.5;
  font-weight: 400;
  color: #b1c7fc;
`

export const CreateFundDaoAvatarBtn = styled.button`
  background: none;
  color: #2669eb;
  font-size: 13px;
  line-height: 1.2;
  font-weight: 600;
  border: none;
  margin-top: 8px;
`

export const CreateFundDaoStepsProgress = styled.div`
  width: 100%;
  height: 1px;
  background: #293c54;
`
