import styled from "styled-components/macro"
import { motion } from "framer-motion"
import theme, { Flex, Text, GradientBorder, BasicCard } from "theme"
import { FC, ReactNode, useState } from "react"
import angle from "assets/icons/angle-up.svg"
import tokenLines from "assets/icons/risky-tokens.svg"
import { dropdownVariants } from "motion/variants"
import { BigNumberInput } from "big-number-input"
import TokenIcon from "components/TokenIcon"
import { DividendToken } from "interfaces"
import { AppButton } from "common"

export const InputContainer = styled(Flex)<{ height?: string }>`
  flex-direction: column;
  justify-content: space-between;
  padding: 16px 16px 16px 16px;
  border-radius: 20px;
  width: 100%;
  height: ${(props) => (props.height ? props.height : "100px")};

  background: #0e1320;
  border: 1px solid rgba(40, 51, 74, 0.5);
`

export const RiskyContainer = styled(GradientBorder)`
  flex-direction: column;
  justify-content: space-between;
  padding: 16px 16px 16px 16px;
  border-radius: 20px;
  width: 100%;
  height: fit-content;

  &:after {
    background: #141926;
  }
`

export const InputTop = styled(Flex)`
  width: 100%;
`

export const InputBottom = styled(Flex)`
  width: 100%;
  padding-top: 18px;
`

export const Price = styled(Text)`
  font-family: ${(props) => props.theme.appFontFamily};
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  text-align: right;
  color: #6781bd;
  user-select: none;
`
export const Balance = styled(Flex)`
  display: flex;
  align-items: center;
  text-align: right;
  user-select: none;
`

export const Tokens = styled.span`
  font-family: ${(props) => props.theme.appFontFamily};
  text-align: right;
  margin-right: 3px;

  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  text-align: right;

  color: #6781bd;
`

export const Symbol = styled.span`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  text-align: right;
  letter-spacing: 0.5px;
  color: #596073;
  padding-left: 5px;
`

export const Max = styled(Text)`
  font-family: ${(props) => props.theme.appFontFamily};
  font-weight: 700;
  font-size: 12px;
  line-height: 110%;
  text-align: right;
  color: #2669eb;
`

export const Input = styled.input`
  font-family: ${(props) => props.theme.appFontFamily};
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.01em;
  color: #e4f2ff;
  outline: none;
  background: transparent;
  border: none;
  padding: 5px 0 0;
  width: 100%;

  &::placeholder {
    color: #e4f2ff;
    font-size: 20px;
    line-height: 20px;
  }

  &:disabled {
    color: #b1c7fc !important;

    &::placeholder {
      color: #b1c7fc !important;
    }
  }
`

export const InputS = styled.input`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  color: #b1c7fc;
  outline: none;
  background: transparent;
  border: none;
  padding: 5px 0 0;
  width: 50%;

  &::placeholder {
    color: #b1c7fc;
    font-size: 12px;
    line-height: 16px;
  }

  &:disabled {
    color: #b1c7fc !important;

    &::placeholder {
      color: #b1c7fc !important;
    }
  }
`

export const ActiveSymbol = styled(Flex)<{ background?: string }>`
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  padding: 5px 9px 5px 5px;
  min-height: 37px;
  border-radius: 19px;

  background: ${(props) => props.background || "rgba(40, 51, 74, 0.5)"};
`

export const SymbolLabel = styled.span`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 15px;
  letter-spacing: 0.3px;
  color: #e4f2ff;
  white-space: nowrap;
  margin: 4px 7px 0 4px;
`

export const SymbolLabelS = styled.span`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: italic;
  font-weight: 400;
  font-size: 13px;
  line-height: 15px;
  text-align: right;

  /* Text/2 */

  color: #b1c7fc;
  white-space: nowrap;
`

export const SelectToken = styled(SymbolLabel)`
  margin-left: 8px;
  transform: translateY(-2px);
`

export const Unlock = styled.div`
  background: linear-gradient(
    270deg,
    rgba(51, 62, 64, 1) 0%,
    rgba(79, 81, 85, 1) 100%
  );
  height: 46px;
  width: 46px;
  border-radius: 14px;
  box-shadow: 0px 0px 7px #ff7f7f;
  margin-left: 14px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Label = styled(Text)`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 100%;
  color: #5a6071;
`

export const Value = styled(Text)`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  color: #5a6071;
`

export const PriceText = styled(Text)`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 100%;
  color: #b1b7c9;
`

// DIVIDER

export const DividerContainer = styled(Flex)`
  user-select: none;
  height: 18px;
  position: relative;
`

export const PercentButton = styled.div<{ active?: boolean }>`
  flex: 1;
  max-width: 70px;
  text-align: center;
  cursor: pointer;

  font-family: ${(props) => props.theme.appFontFamily};

  border-radius: 3px;

  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  color: #6781bd;

  &:first-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  &:last-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`

export const SwapButton = styled.div`
  cursor: pointer;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Icon = styled(motion.img)`
  z-index: 20;
`

// FORM CARD

export const Container = styled(Flex)`
  width: 100%;
  padding: 16px;
  align-items: center;
  flex-direction: column;
  overflow-y: auto;
`

export const Card = styled(BasicCard)`
  flex-direction: column;
  padding: 20px 16px;
  position: relative;
  border-radius: 20px;
  background: #141926;
  max-width: 420px;
  margin: auto;
  gap: 16px;
`

export const CardHeader = styled(Flex)`
  width: 100%;
`

export const CardForm = styled(Flex)`
  flex-direction: column;
  width: 100%;
`

export const Title = styled.div<{ active?: boolean }>`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 16px;
  color: ${(props) => (props.active ? "#e4f2ff" : "#B1C7FC")};

  &:nth-child(2) {
    margin-left: 24px;
  }
`

export const IconsGroup = styled(Flex)`
  width: 152px;
  justify-content: flex-end;
  gap: 16px;
`

// INFO CARD

export const InfoCard = styled(GradientBorder)`
  padding: 16px;
  flex-direction: column;
  border-radius: 20px;
  width: fill-available;
  margin-top: 16px;

  &:after {
    background: #181e2c;
  }
`

export const InfoRow = styled(Flex)`
  width: fill-available;
  justify-content: space-between;
`

export const InfoGrey = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 15px;
  color: #b1c7fc;
`

export const InfoWhite = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  text-align: right;
  letter-spacing: 0.01em;
  color: #e4f2ff;
`

export const AngleIcon = styled(motion.img)`
  transform: translate(2px, -1px);
`

const DropdownContainer = styled(Flex)`
  flex-direction: column;
  padding: 0 16px 0 0;
  width: 100%;
  box-sizing: border-box;
  gap: 12px;
`

const iconVariants = {
  visible: {
    transform: `translate(2px, -1px) rotate(0deg)`,
  },
  hidden: {
    transform: `translate(2px, -1px) rotate(180deg)`,
  },
}

interface DropdownProps {
  left: ReactNode
  right: ReactNode
  children?: ReactNode
}

export const InfoDropdown: FC<DropdownProps> = ({ left, right, children }) => {
  const [isOpen, setOpen] = useState(false)

  return (
    <>
      <InfoRow onClick={() => setOpen(!isOpen)}>
        {left}
        <Flex>
          {right}
          <AngleIcon
            initial="hidden"
            variants={iconVariants}
            animate={isOpen ? "visible" : "hidden"}
            src={angle}
          />
        </Flex>
      </InfoRow>
      <DropdownContainer
        initial="hidden"
        variants={dropdownVariants}
        animate={isOpen ? "visible" : "hidden"}
      >
        {children}
      </DropdownContainer>
    </>
  )
}

// RECEIVED TOKEN

export const TokensContainer = styled(Flex)`
  width: 100%;
  flex-direction: column;
`

export const TokenContainer = styled(Flex)`
  position: relative;
  width: 100%;

  &:first-child {
    &:before {
      content: "";
      position: absolute;
      left: -23px;
      top: -42px;
      width: 17px;
      height: 75px;
      background: url(${tokenLines});
      background-size: contain;
    }
  }
`

export const TokenInfo = styled(Flex)`
  justify-content: flex-start;
  width: fit-content;
`

export const TokenText = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 100%;
  color: #b1c7fc;
`

// DIVIDENDS INPUT

export const AddButton = styled.button`
  background: none;
  border: none;
  outline: none;
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #2669eb;
  cursor: pointer;
`

export const ButtonDivider = styled.div`
  width: fill-available;
  height: 1px;

  background: #1c2437;
  border-radius: 16px;
  margin: 16px 0;
`

const DividendsTokenContainer = styled(Flex)`
  height: 48px;
  padding: 16px;

  background: #1c2437;
  border-radius: 16px;
  width: fill-available;
`

export const DividendsList = styled(Flex)`
  gap: 16px;
  width: fill-available;
  flex-direction: column;
`

export const DividendsToken = ({ token }: { token: DividendToken }) => {
  return (
    <DividendsTokenContainer>
      <BigNumberInput
        decimals={18}
        onChange={() => {}}
        value="0"
        renderInput={(props: any) => <InputS inputMode="decimal" {...props} />}
      />
      <Flex gap="8">
        <SymbolLabelS>DEXE</SymbolLabelS>

        <TokenIcon m="0" address={token.address} />
      </Flex>
    </DividendsTokenContainer>
  )
}

// TODO: replace with AppButton
export const BlueButton = styled.button`
  background: none;
  outline: none;
  border: none;
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #2669eb;
`

export const NftCounter = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: ${theme.textColors.primary};
  flex: none;
  order: 0;
  flex-grow: 0;
`

export const TooltipText = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  color: ${theme.textColors.secondary};
`

export const SubmitButton = styled(AppButton)`
  width: fill-available;
  grid-gap: 3px;
`

export const DescriptionContainer = styled.p`
  padding: 0;
  margin: 0;
  width: fill-available;
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 150%;
  color: ${theme.textColors.secondary};

  & > a {
    display: inline;
    color: ${theme.brandColors.secondary};
  }
`
