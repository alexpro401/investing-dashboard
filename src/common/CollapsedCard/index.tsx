import React, { useState, useCallback } from "react"

import { ICON_NAMES } from "consts/icon-names"

import * as S from "./styled"

interface ICollapsedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  title: string
}

const CollapsedCard: React.FC<ICollapsedCardProps> = ({
  children,
  title,
  ...rest
}) => {
  const [opened, setOpened] = useState<boolean>(true)

  const handleToggleOpenedStatus = useCallback(() => {
    setOpened((s) => !s)
  }, [setOpened])

  return (
    <S.CollCard {...rest} isOpen={opened}>
      <S.CollCardTopbar>
        <S.CollCardHead>
          <S.CollCardTitle>{title}</S.CollCardTitle>
        </S.CollCardHead>
        <S.CollCardHeadButton
          animate={{ rotate: opened ? 180 : 0 }}
          onClick={handleToggleOpenedStatus}
        >
          <S.CollapseIcon name={ICON_NAMES.angleDown} />
        </S.CollCardHeadButton>
      </S.CollCardTopbar>
      <S.CustomCollapse isOpen={opened}>{children}</S.CustomCollapse>
    </S.CollCard>
  )
}

export default CollapsedCard
