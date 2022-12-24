import React from "react"
import styled from "styled-components/macro"
import { motion } from "framer-motion"
import { useScroll } from "react-use"
import { SpiralSpinner } from "react-spinners-kit"

import theme, { Text } from "theme"

const LoadMoreIcon = styled(motion.div)`
  cursor: pointer;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px auto;
  z-index: 100;
  height: 50px;
  width: fill-available;
`

const LoadMore: React.FC<{
  r: any
  isLoading: boolean
  handleMore: () => void
}> = ({ r, isLoading, handleMore }) => {
  return (
    <LoadMoreIcon onClick={handleMore}>
      {isLoading ? (
        <SpiralSpinner size={30} loading />
      ) : (
        <Text color={theme.brandColors.secondary} fw={600}>
          Load more
        </Text>
      )}
    </LoadMoreIcon>
  )
}

export default LoadMore
