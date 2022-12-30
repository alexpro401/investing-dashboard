import React, { useState, useCallback } from "react"
import { AnimatePresence } from "framer-motion"

import { Icon } from "common"
import { ICON_NAMES } from "consts/icon-names"

import * as S from "./styled"

type ITutorialCardProps = {
  text: string
  linkText: string
  imageSrc: string
} & ({ href: string; to?: never } | { to: string; href?: never })

const TutorialCard: React.FC<ITutorialCardProps> = ({
  text,
  linkText,
  imageSrc,
  href,
  to,
}) => {
  const [isOpened, setIsOpened] = useState<boolean>(true)

  const handleCloseCard = useCallback(() => {
    setIsOpened(false)
  }, [])

  return (
    <AnimatePresence>
      {isOpened && (
        <S.TutorialCardBlock
          exit={{
            height: 0,
            opacity: 0,
            paddingTop: 0,
            paddingBottom: 0,
            transition: { duration: 0.2 },
          }}
          initial={{
            paddingTop: 20,
            paddingBottom: 20,
            height: "auto",
            opacity: 1,
          }}
          animate={{
            height: "auto",
            opacity: 1,
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          <S.HighlightDecor />
          <S.TutorialCardBlockTitle>{text}</S.TutorialCardBlockTitle>
          {to && (
            <S.TutorialCardBlockNavLink to={to}>
              {linkText}
            </S.TutorialCardBlockNavLink>
          )}
          {!to && href && (
            <S.TutorialCardBlockLink
              rel="noopener noreferrer"
              target="_blank"
              href={href}
            >
              {linkText}
            </S.TutorialCardBlockLink>
          )}
          <S.TutorialCardImg src={imageSrc} />
          <S.TutorialCardCloseBtn onClick={handleCloseCard}>
            <Icon name={ICON_NAMES.close} />
          </S.TutorialCardCloseBtn>
        </S.TutorialCardBlock>
      )}
    </AnimatePresence>
  )
}

export default TutorialCard
