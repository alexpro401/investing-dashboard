import styled from "styled-components/macro"

export const Icon = styled.img<{ size?: number; m: string }>`
  box-sizing: border-box;
  height: ${(props) => (props.size ? props.size : 28)}px;
  width: ${(props) => (props.size ? props.size : 28)}px;
  min-height: ${(props) => (props.size ? props.size : 28)}px;
  min-width: ${(props) => (props.size ? props.size : 28)}px;
  border-radius: 50px;
  margin: ${(props) => props.m};
`

export const Loader = styled.div<{ size?: number; m: string }>`
  box-sizing: border-box;
  height: ${(props) => (props.size ? props.size : 28)}px;
  width: ${(props) => (props.size ? props.size : 28)}px;
  min-height: ${(props) => (props.size ? props.size : 28)}px;
  min-width: ${(props) => (props.size ? props.size : 28)}px;
  margin: ${(props) => props.m};
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(64.44deg, #191e2b 32.35%, #272e3e 100%);
`
