import React, { useState, useRef, ReactNode } from "react"
import { FloatingContainer, Header, Overlay, Container, Handle } from "./styled"

// TODO: if content height > greater than window height, then use scroll of that content

const Popover: React.FC<{
  title: string | ReactNode
  isOpen: boolean
  toggle: (state: boolean) => void
  contentHeight: number
  noDrag?: boolean
  children?: ReactNode
}> = ({ title, children, isOpen, toggle, contentHeight, noDrag }) => {
  const [isDragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // detect dragging down by 25% of screen height
  const handleDragEnd = (e, info) => {
    setDragging(false)
    if (window?.innerHeight / 2 + window?.innerHeight / 15 < info.point.y) {
      toggle(false)
    }
  }

  const handleDragStart = () => {
    setDragging(true)
  }

  return (
    <>
      <Overlay
        onClick={() => toggle(!isOpen)}
        animate={isOpen ? "visible" : "hidden"}
        initial="hidden"
        variants={{
          visible: {
            opacity: 0.4,
            display: "block",
          },
          hidden: {
            opacity: 0,
            transitionEnd: { display: "none" },
          },
        }}
      />
      <FloatingContainer
        drag={noDrag ? false : "y"}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 5 }}
        dragElastic={0.5}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        animate={isOpen ? "visible" : "hidden"}
        initial="hidden"
        transition={{ duration: 0.4, ease: [0.29, 0.98, 0.29, 1] }}
        variants={{
          visible: {
            display: "block",
            top: `${window.innerHeight - contentHeight}px`,
          },
          hidden: {
            transitionEnd: { display: "none" },
            top: `${window.innerHeight}px`,
          },
        }}
      >
        <Container ref={containerRef}>
          <Handle active={isDragging} />
          <Header>{title}</Header>
          {children}
        </Container>
      </FloatingContainer>
    </>
  )
}

export default Popover
