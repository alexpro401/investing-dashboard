import RadioButton from "components/RadioButton"
import React, { useMemo } from "react"
import styled from "styled-components"
import { AnimatePresence, motion } from "framer-motion"

interface FundTypeCardProps {
  label: string
  description: string
  name: "basic" | "investment" | "daoPool"
  selected: string
  handleSelect: (value: any) => void
  link?: string
  fundFeatures?: string[]
}

const ContainerCard = styled.div<{
  withBackground?: boolean
  shadow?: boolean
  isActive?: boolean
}>`
  padding: 28px 10px 26px 16px;
  box-sizing: border-box;
  background: linear-gradient(64.44deg, #10151f 32.35%, #181d26 100%);
  mix-blend-mode: normal;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.01);
  border: 1px solid ${(props) => (props.isActive ? "#9AE2CB" : "#26324482")};
  border-radius: 16px;
  margin-bottom: 16px;
  background: ${(props) =>
    props.withBackground
      ? "linear-gradient(64.44deg, #10151F 32.35%, #181D26 100%)"
      : "transparent"};
  box-shadow: ${(props) =>
    props.shadow ? "0px 4px 4px rgba(0, 0, 0, 0.01)" : "none"};
`

const Body = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
`

const Text = styled.div``

const Label = styled.div`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 14px;
  color: #e4f2ff;
  text-align: left;
  margin-bottom: 12px;
`

const Description = styled.div`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 1.5;
  letter-spacing: 0.03em;
  color: #b1c7fc;
`

const Link = styled.a`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.03em;
  color: #0165c2;
  text-decoration: none;
`

const Features = styled(motion.div).attrs(() => ({
  initial: "collapsed",
  animate: "open",
  exit: "collapsed",
  variants: {
    open: { opacity: 1, height: "auto" },
    collapsed: { opacity: 0, height: 0 },
  },
  transition: { duration: 0.5 },
}))`
  display: grid;
  grid-gap: 8px;
  grid-column: 2 / 3;
  margin-top: 16px;
`

const FeatureItem = styled.div`
  font-size: 13px;
  line-height: 1.5;
  font-weight: 500;
  color: #b1c7fc;
`

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
    <ContainerCard
      onClick={() => handleSelect(name)}
      withBackground={isActive}
      shadow={isActive}
      isActive={isActive}
    >
      <Body>
        <RadioButton selected={selected} value={name} onChange={handleSelect} />
        <Text>
          <Label>{label}</Label>
          <Description>{description}</Description>
          {link ? <Link href={link}>Read more</Link> : <></>}
        </Text>
        <AnimatePresence initial={false}>
          {fundFeatures.length && isActive && (
            <Features>
              {fundFeatures.map((feature, index) => (
                <FeatureItem key={index}>{feature}</FeatureItem>
              ))}
            </Features>
          )}
        </AnimatePresence>
      </Body>
    </ContainerCard>
  )
}

export default FundTypeCard
