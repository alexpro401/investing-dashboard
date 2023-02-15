import React, { useState, useEffect, useMemo, useRef, memo } from "react"
import { useWeb3React } from "@web3-react/core"
import { MetroSpinner } from "react-spinners-kit"
import styled from "styled-components/macro"
import { Icon as CommonIcon } from "common"

import { Flex } from "theme"
import { useSelector } from "react-redux"
import { selectDexeAddress } from "state/contracts/selectors"
import { ICON_NAMES } from "consts/icon-names"
import { useERC20Data } from "state/erc20/hooks"

import mainAsset from "assets/tokens/bnb.png"

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
  align-items: center;
`

export const SymbolLetter = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 16px;
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
  /* border: 2px solid #171b1f; */
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(64.44deg, #191e2b 32.35%, #272e3e 100%);
`

interface BaseProps {
  size?: number
  m?: string
}

interface IDefaultProps extends BaseProps {
  symbol: string
}

interface IProps extends BaseProps {
  address?: string
}

const getIconsPathByChain = (chainId, address) => {
  if (!address || !chainId) return

  const a = address.toLowerCase()

  switch (chainId) {
    case 97:
      return `https://pancake.kiemtienonline360.com/images/coins/${a}.png`
    default:
      return `https://pancake.kiemtienonline360.com/images/coins/${a}.png`
  }
}

const setImageBroken = (chainId, account, address) => {
  localStorage.setItem(`broken-${chainId}-${account}-${address}`, "true")
}

const checkImageBroken = (chainId, account, address) => {
  return (
    localStorage.getItem(`broken-${chainId}-${account}-${address}`) === "true"
  )
}

export const DefaultTokenIcon = memo(function DefaultTokenIcon({
  size,
  m,
  symbol,
}: IDefaultProps) {
  return (
    <Fallback m={m!} size={size}>
      <SymbolLetter>{symbol[0].toLocaleUpperCase()}</SymbolLetter>
    </Fallback>
  )
})

const TokenIcon: React.FC<IProps> = ({ size, address, m = "0 8px 0 0" }) => {
  const { account, chainId } = useWeb3React()
  const ref = useRef() as React.MutableRefObject<HTMLImageElement>
  const src = getIconsPathByChain(chainId, address)

  const dexeAddress = useSelector(selectDexeAddress)

  const isBroken = useMemo(
    () => checkImageBroken(chainId, account, address),
    [account, address, chainId]
  )

  const [srcImg, setImg] = useState<string | undefined>()
  const [noImage, setNoImage] = useState(isBroken)
  const [isLoading, setLoadingState] = useState(!isBroken)
  const [tokenData] = useERC20Data(noImage ? address : undefined)

  useEffect(() => {
    if (!src) return

    if (isBroken) {
      setNoImage(true)
      setLoadingState(false)
      return
    }

    setLoadingState(true)

    const token = new Image()
    token.src = src

    const imageLoad: any = token.addEventListener("load", () => {
      setImg(src)
      setNoImage(false)
      setLoadingState(false)
    })

    const imageError: any = token.addEventListener("error", () => {
      setNoImage(true)
      setLoadingState(false)
      setImageBroken(chainId, account, address)
    })

    return () => {
      token.removeEventListener(imageLoad, imageError)
    }
  }, [account, address, chainId, isBroken, src])

  if (
    address?.toLocaleLowerCase() === process.env.REACT_APP_MAIN_ASSET_ADDRESS
  ) {
    return <Icon ref={ref} m={m!} src={mainAsset} size={size} />
  }

  if (address?.toLocaleLowerCase() === dexeAddress.toLocaleLowerCase()) {
    return (
      <CommonIcon
        name={ICON_NAMES.dexeTokenIcon}
        style={{ margin: m, width: size, height: size }}
      />
    )
  }

  if (noImage && tokenData) {
    return <DefaultTokenIcon symbol={tokenData.symbol} m={m} size={size} />
  }

  if (isLoading) {
    return (
      <Loader m={m!} size={size}>
        <MetroSpinner color="#A4EBD4" size={size ? size / 2 : 12} />
      </Loader>
    )
  }

  return (
    <>
      <Icon ref={ref} m={m!} src={srcImg} size={size} />
    </>
  )
}

export default TokenIcon
