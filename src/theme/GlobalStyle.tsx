import { createGlobalStyle, css } from "styled-components"
import styled from "styled-components"
import { device } from "theme"
import { motion } from "framer-motion"

import "swiper/swiper-bundle.min.css"
import "swiper/swiper.min.css"

export const GradientSVG = () => {
  const gradientTransform = `rotate(${180})`

  return (
    <svg style={{ height: 0, width: 0 }}>
      <defs>
        <linearGradient
          id="progress-bar-gradient"
          gradientTransform={gradientTransform}
        >
          <stop offset="0%" stopColor="#A4EBD4" />
          <stop offset="92%" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const SwiperGlobalStyle = css`
  :root {
    --swiper-theme-color: #7fffd4;

    --swiper-pagination-bullet-size: 4px;
    --swiper-pagination-bullet-width: 4px;
    --swiper-pagination-bullet-height: 4px;
    --swiper-pagination-bullet-horizontal-gap: 4px;

    --swiper-pagination-color: #7fffd4;
    --swiper-pagination-bullet-inactive-opacity: 1;
    --swiper-pagination-bullet-inactive-color: #293c54;
  }
`

const GlobalStyle: any = createGlobalStyle`
  body {
    width:100%;
    overflow-x:hidden;
    overflow-y:hidden;
    background: #0E121B;
    min-height: -webkit-fill-available;
    touch-action: none;
    overscroll-behavior: none;
    user-select: none;
  }

  html {
    height: -webkit-fill-available;
    touch-action: none;
    overscroll-behavior: none;
  }

  #root * {
    box-sizing: border-box;
    font-family: Gilroy, Open-Sans, Helvetica, Sans-Serif;
  }

  #root {
    min-height: fill-available;
    min-height: -webkit-fill-available;
    touch-action: none;
    overscroll-behavior: none;
  }

  .ReactVirtualized__Grid,
  .ReactVirtualized__List {
    &:focus {
      outline: none;
    }
  }

  p {
    margin: 3px 0 2px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }

  @keyframes animateButton {
    from {
      background: linear-gradient(
        90deg,
        rgba(127, 255, 212, 0.75) 0%,
        rgba(38, 128, 235, 0.75) 100%
      );
    }

    to {
      background: linear-gradient(
        90deg,
        rgba(127, 255, 212, 0.75) 0%,
        rgba(255, 127, 127, 0.75) 100%
      );
    }
  }
  ${SwiperGlobalStyle}
`

export const SpecialModalBackground = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  background: rgba(13, 18, 28, 0.3);
  backdrop-filter: blur(1px);
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;

  @media only screen and (${device.sm}) {
    bottom: 62px;
    height: auto;
  }
`

export const AppWrapper = styled.div`
  background: linear-gradient(64.44deg, #0c1017 32.35%, #181d26 100%);
  min-height: -webkit-fill-available;

  display: grid;

  // display: grid;

  // grid-template-columns: 50px 1fr;
  // grid-template-areas: "menu content";
  // height: inherit;
  // overscroll-behavior: none;
  // touch-action: none;

  // @media only screen and (${device.sm}) {
  //   display: grid;
  //   grid-template-columns: 1fr;
  //   grid-template-rows: 1fr 0px;
  //   grid-template-areas: "content" "bottom";
  //   gap: 0px 0px;
  //   justify-items: stretch;
  //   align-items: stretch;
  // }
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  z-index: 5;
  touch-action: none;
  overscroll-behavior: none;
  transition: 0.2s all;
  overflow-x: hidden;
  overflow-y: hidden;
  // min-height: -webkit-fill-available;

  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 100);
`

export default GlobalStyle
