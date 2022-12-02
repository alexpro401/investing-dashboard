import React, { FC, HTMLAttributes, useMemo } from "react"
import { AnimatePresence, motion, MotionProps } from "framer-motion"
import { v4 as uuidv4 } from "uuid"
import { accordionBaseVariants } from "motion/variants"

type Props = {
  isOpen: boolean
  duration?: number
  cRef?: React.Ref<HTMLDivElement>
} & HTMLAttributes<HTMLDivElement> &
  MotionProps

const Collapse: FC<Props> = ({
  isOpen,
  duration = 0.15,
  children,
  cRef,
  ...rest
}) => {
  const uid = useMemo(() => uuidv4(), [])

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key={`collapse-${uid}`}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={accordionBaseVariants}
          transition={{ duration: duration }}
          ref={cRef ?? undefined}
          {...rest}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Collapse
