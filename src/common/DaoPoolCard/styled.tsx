import styled from "styled-components/macro"
import { Text } from "theme"
import { motion } from "framer-motion"

export const Animation = styled(motion.div).attrs((p: { index: number }) => ({
  initial: p.index === 0 ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -5 },
  transition: {
    duration: 0.2,
    delay: p.index === 0 ? 0 : 0.01,
    ease: [0.29, 0.98, 0.29, 1],
  },
}))<{ index: number }>`
  width: 100%;
`

export const Root = styled.div`
  background: ${(props) => props.theme.backgroundColors.secondary};
  border-radius: 20px;
  color: ${(props) => props.theme.textColors.primary};
`

export const DaoPoolCardHead = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
`

export const DaoPoolCardTitle = styled(Text).attrs(() => ({
  color: "#ffffff",
  fw: 700,
  fz: 16,
  lh: "20px",
}))``

export const DaoPoolCardDescription = styled(Text).attrs(() => ({
  block: true,
  color: "#B1C7FC",
  fw: 400,
  fz: 13,
  lh: "15px",
}))<{ align?: string }>`
  text-align: ${({ align }) => align ?? "right"};
`

export const DaoPoolCardVotingPower = styled(Text).attrs(({ theme }) => ({
  color: theme.statusColors.success,
  fw: 700,
  fz: 16,
  lh: "16px",
}))`
  letter-spacing: 1px;
`

export const DaoPoolCardDivider = styled.div`
  background: radial-gradient(
      54.8% 53% at 50% 50%,
      #587eb7 0%,
      rgba(88, 126, 183, 0) 100%
    ),
    radial-gradient(
      60% 51.57% at 50% 50%,
      #6d99db 0%,
      rgba(109, 153, 219, 0) 100%
    ),
    radial-gradient(
      69.43% 69.43% at 50% 50%,
      rgba(5, 5, 5, 0.5) 0%,
      rgba(82, 82, 82, 0) 100%
    );
  opacity: 0.1;
  width: fill-available;
  margin-left: 63px;
  height: 1px;
`

export const Content = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 0 12px;
`

export const DaoPoolCardBlockInfoValue = styled(Text).attrs(() => ({
  block: true,
  color: "#f7f7f7",
  fw: 600,
  fz: 16,
  lh: "16px",
}))``

export const DaoPoolCardBlockInfoLabel = styled(Text).attrs(() => ({
  block: true,
  color: "#B1C7FC",
  fw: 600,
  fz: 11,
  lh: "20px",
}))``
