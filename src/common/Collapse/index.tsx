import { AnimatePresence, motion, MotionProps } from "framer-motion"
import { FC, HTMLAttributes, useMemo } from "react"
import { v4 as uuidv4 } from "uuid"
import { accordionBaseVariants } from "motion/variants"

type Props = {
  isOpen: boolean
  duration?: number
} & HTMLAttributes<HTMLDivElement> &
  MotionProps

const Collapse: FC<Props> = ({
  isOpen,
  duration = 0.15,
  children,
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
          {...rest}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Collapse
