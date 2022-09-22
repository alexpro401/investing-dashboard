import React, { useMemo } from "react"

import RadioButton from "components/RadioButton"
import { Collapse } from "common"

import * as S from "./styled"

interface FundTypeCardProps {
  label: string
  description: string
  name: "basic" | "investment" | "daoPool"
  selected: string
  handleSelect: (value: any) => void
  link?: string
  fundFeatures?: string[]
}

const FundTypeCard: React.FC<FundTypeCardProps> = ({
  label,
  description,
  selected,
  name,
  handleSelect,
  link = "",
  fundFeatures = [],
}) => {
  const isActive = useMemo(() => name === selected, [name, selected])
  return (
    <S.FundTypeCardContainerCard
      onClick={() => handleSelect(name)}
      withBackground={isActive}
      shadow={isActive}
      isActive={isActive}
    >
      <S.FundTypeCardBody>
        <RadioButton selected={selected} value={name} onChange={handleSelect} />
        <S.FundTypeCardText>
          <S.FundTypeCardLabel>{label}</S.FundTypeCardLabel>
          <S.FundTypeCardDescription>{description}</S.FundTypeCardDescription>
          {link ? (
            <S.FundTypeCardLink href={link}>Read more</S.FundTypeCardLink>
          ) : (
            <></>
          )}
        </S.FundTypeCardText>
        <S.FundTypeCardAccordionWrapper>
          <Collapse isOpen={Boolean(fundFeatures.length && isActive)}>
            <S.FundTypeCardFeatures>
              {fundFeatures.map((feature, index) => (
                <S.FundTypeCardFeatureItem key={index}>
                  {feature}
                </S.FundTypeCardFeatureItem>
              ))}
            </S.FundTypeCardFeatures>
          </Collapse>
        </S.FundTypeCardAccordionWrapper>
      </S.FundTypeCardBody>
    </S.FundTypeCardContainerCard>
  )
}

export default FundTypeCard
