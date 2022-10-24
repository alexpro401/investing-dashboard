import React, { useState, useEffect, useMemo } from "react"
import { useWeb3React } from "@web3-react/core"
import { WhisperSpinner } from "react-spinners-kit"
import styled from "styled-components"

import { Flex } from "theme"
import dexe from "assets/icons/dexe.svg"
import { useERC20 } from "hooks/useERC20"

interface IconProps {
  size?: number
  m: string
}

export const Fallback = styled(Flex)<IconProps>`
  height: ${(props) => (props.size ? props.size : 28)}px;
  width: ${(props) => (props.size ? props.size : 28)}px;
  min-height: ${(props) => (props.size ? props.size : 28)}px;
  min-width: ${(props) => (props.size ? props.size : 28)}px;
  border-radius: 50px;
  margin: ${(props) => props.m};
  background: ${({ theme }) => theme.textColors.secondaryNegative};
  justify-content: center;
`

export const SymbolLetter = styled.div`
  transform: translate(0px, 1px);
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  font-feature-settings: "tnum" on, "lnum" on;
  color: ${({ theme }) => theme.textColors.secondary};
  opacity: 0.5;
`

export const Icon = styled.img<IconProps>`
  height: ${(props) => (props.size ? props.size : 28)}px;
  width: ${(props) => (props.size ? props.size : 28)}px;
  min-height: ${(props) => (props.size ? props.size : 28)}px;
  min-width: ${(props) => (props.size ? props.size : 28)}px;
  border-radius: 50px;
  margin: ${(props) => props.m};
`

export const Loader = styled.div<IconProps>`
  height: ${(props) => (props.size ? props.size : 28)}px;
  width: ${(props) => (props.size ? props.size : 28)}px;
  min-height: ${(props) => (props.size ? props.size : 28)}px;
  min-width: ${(props) => (props.size ? props.size : 28)}px;
  margin: ${(props) => props.m};
  border-radius: 50px;
  border: 2px solid #171b1f;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(64.44deg, #191e2b 32.35%, #272e3e 100%);
`

interface IProps {
  size?: number
  address?: string
  m?: string
}

const getIconsPathByChain = (id, address) => {
  if (!address) return

  const a = address.toLowerCase()

  if (a === "0xa651edbbf77e1a2678defae08a33c5004b491457") {
    return dexe
  }
  if (id === 97) {
    return `https://pancake.kiemtienonline360.com/images/coins/${a}.png`
  }
  return `https://pancake.kiemtienonline360.com/images/coins/${a}.png`
}

const setImageBroken = (chainId, account, address) => {
  localStorage.setItem(`broken-${chainId}-${account}-${address}`, "true")
}

const checkImageBroken = (chainId, account, address) => {
  return (
    localStorage.getItem(`broken-${chainId}-${account}-${address}`) === "true"
  )
}

const TokenIcon: React.FC<IProps> = ({ size, address, m }) => {
  const { account, chainId } = useWeb3React()
  const src = getIconsPathByChain(chainId, address)

  const isBroken = useMemo(
    () => checkImageBroken(chainId, account, address),
    [account, address, chainId]
  )

  const [srcImg, setImg] = useState<string | undefined>()
  const [noImage, setNoImage] = useState(isBroken)
  const [isLoading, setLoadingState] = useState(!isBroken)
  const [, tokenData] = useERC20(noImage ? address : undefined)

  useEffect(() => {
    if (!src) return

    const token = new Image()
    token.src = src

    const imageLoad: any = token.addEventListener("load", () => {
      setImg(src)
      setNoImage(false)
      setLoadingState(false)
    })

    const imageError: any = token.addEventListener("error", () => {
      setImageBroken(chainId, account, address)
      setNoImage(true)
      setLoadingState(false)
    })

    return () => {
      token.removeEventListener(imageLoad, imageError)
    }
  }, [account, address, chainId, src])

  if (noImage && tokenData) {
    return (
      <Fallback m={m || "0 8px 0 0"} size={size}>
        <SymbolLetter>{tokenData.symbol[0]}</SymbolLetter>
      </Fallback>
    )
  }

  if (isLoading) {
    return (
      <Loader m={m || "0 8px 0 0"} size={size}>
        <WhisperSpinner color="#A4EBD4" size={size ? size / 2 : 20} />
      </Loader>
    )
  }

  return <Icon m={m || "0 8px 0 0"} src={srcImg} size={size} />
}

export default TokenIcon
