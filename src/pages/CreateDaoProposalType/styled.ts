import styled from "styled-components"
import { motion } from "framer-motion"

export const CreateNewDaoProposalTypePageHolder = styled(motion.div).attrs(
  () => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  })
)`
  width: 100%;
  height: calc(100vh - 94px);
  overflow-y: auto;
`
