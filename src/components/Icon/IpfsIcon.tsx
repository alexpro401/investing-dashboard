import React, { useState, useEffect } from "react"
import { Icon as CommonIcon } from "common"

import { getIpfsData } from "utils/ipfs"

import { Icon } from "./styled"

import IconLoader from "./IconLoader"

import defaultAvatar from "assets/icons/default-avatar.svg"
import { ICON_NAMES } from "constants/icon-names"

interface IProps {
  size?: number
  hash?: string
  m?: string
}

const IpfsIcon: React.FC<IProps> = ({ size, hash, m }) => {
  const [src, setSrc] = useState("")
  const [srcImg, setImg] = useState<string>()
  const [isLoading, setLoadingState] = useState(true)

  useEffect(() => {
    if (!hash) {
      setSrc(defaultAvatar)
      return
    }

    ;(async () => {
      const data = await getIpfsData(hash)
      if (
        data &&
        data.assets &&
        data.assets.length &&
        data.assets[data.assets.length - 1] !== ""
      ) {
        setSrc(data.assets[data.assets.length - 1])
      } else {
        setSrc(defaultAvatar)
      }
    })()
  }, [hash])

  useEffect(() => {
    if (!src) return

    const token = new Image()
    token.src = src

    const imageLoad: any = token.addEventListener("load", () => {
      setImg(src)
      setLoadingState(false)
    })

    const imageError: any = token.addEventListener("error", () => {
      setImg(defaultAvatar)
      setLoadingState(false)
    })

    return () => {
      token.removeEventListener(imageLoad, imageError)
    }
  }, [src])

  if (!srcImg) return <CommonIcon name={ICON_NAMES.unknownToken} />

  if (isLoading) {
    return <IconLoader m={m} size={size} />
  }

  return <Icon m={m || "0 8px 0 0"} src={srcImg} size={size} />
}

export default IpfsIcon
