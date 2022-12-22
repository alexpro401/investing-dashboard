import { respondTo } from "theme"
import styled from "styled-components"

export const Img = styled.img<{ size: number }>`
  display: block;
  margin: 0 auto;
  width: ${(props) => `${props.size}px`};
  height: ${(props) => `${props.size}px`};
  min-width: ${(props) => `${props.size}px`};
  min-height: ${(props) => `${props.size}px`};
  border-radius: 150px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
`

export const Overlay = styled.div<{ size: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${(props) => `${props.size}px`};
  height: ${(props) => `${props.size}px`};
  background: rgba(24, 30, 44, 0.87);
  border-radius: 150px;
`

export const HoverCamera = styled.div`
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  height: fill-available;
  width: 100%;
  border-radius: 150px;
  transition: all 0.4s ease-in-out;
  opacity: 1;
`

export const FileUpload = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  -webkit-appearance: none;
  outline: none;
  height: fill-available;
  width: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 20;
`

export const CameraIcon = styled.img`
  margin: auto;
  transition: all 0.2s cubic-bezier(0.63, 0.08, 0.49, 0.84);
  position: absolute;
  left: 0;
  right: 0;
  bottom: 25px;
  width: 18px;
  top: 0;

  ${respondTo("xs")} {
    bottom: 10px;
  }
`

export const Container = styled.div<{ margin: string }>`
  position: relative;
  border-radius: 150px;
  width: fit-content;
  height: fit-content;
  margin: ${(props) => props.margin};
  /* overflow: hidden; */

  &:hover {
    ${HoverCamera} {
      opacity: 1;
    }
    ${CameraIcon} {
      bottom: 25px;
    }
  }
`

export const JazzContainer = styled.div<{ size: number }>`
  display: block;
  width: ${(props) => `${props.size}px`};
  height: ${(props) => `${props.size}px`};
  margin: 0 auto;
`
