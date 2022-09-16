import { AnimatePresence, motion } from "framer-motion"
import { FC, HTMLAttributes, useMemo } from "react"
import { v4 as uuidv4 } from "uuid"

interface Props extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
}

const Collapse: FC<Props> = ({ isOpen, children }) => {
  const uid = useMemo(() => uuidv4(), [])

  return (
    <AnimatePresence initial={false}>
      {isOpen ? (
        <motion.div
          key={`collapse-${uid}`}
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { opacity: 1, height: "auto" },
            collapsed: { opacity: 0, height: 0 },
          }}
          transition={{ duration: 0.15 }}
        >
          {children}
        </motion.div>
      ) : (
        <></>
      )}
    </AnimatePresence>
  )
}

export default Collapse
