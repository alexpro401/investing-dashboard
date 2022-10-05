import React, { useState, useCallback } from "react"
import { AnimatePresence } from "framer-motion"

import { Icon } from "common"
import { ICON_NAMES } from "constants/icon-names"
import { opacityVariants } from "motion/variants"

import * as S from "./styled"

interface ITutorialCardProps {
  text: string
  imageSrc: string
  href: string
}

const TutorialCard: React.FC<ITutorialCardProps> = ({
  text,
  imageSrc,
  href,
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
          <S.TutorialCardBlockLink rel="noreferrer" target="_blank" href={href}>
            Read the documentation
          </S.TutorialCardBlockLink>
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
