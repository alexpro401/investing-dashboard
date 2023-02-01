import { useState, useRef, ReactNode } from "react"

import { useClickAway } from "react-use"
import { Flex } from "theme"

import * as S from "./styled"

export const floatingBodyVariants = {
  visible: {
    height: "fit-content",
    y: 0,
    display: "block",
    opacity: 1,
  },
  hidden: {
    height: 0,
    opacity: 0,
    y: -5,
    transitionEnd: {
      display: "none",
    },
  },
}

const simpleVariants = {
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
}

interface Props {
  name: string
  icon?: string
  label?: React.ReactElement | string
  placeholder?: string
  data?: string[]
  children?: ReactNode
  position?: "right" | "left"
  value?: string
  onChange?: (name: string, value: string) => void
  noClickAway?: boolean
}

const Dropdown: React.FC<Props> = (props) => {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)

  const list = props.data || []
  const toggle = () => setOpen(!open)

  useClickAway(ref, () => {
    setOpen(false)
  })

  const label =
    typeof props.label === "string" ? (
      <>
        <S.Label>{props.label}</S.Label>

        {!props.value ? (
          <S.Value>{props.placeholder}</S.Value>
        ) : (
          <S.Value>{props.value}</S.Value>
        )}
      </>
    ) : (
      props.label
    )

  return (
    <S.StyledDropdown ref={ref}>
      <Flex onClick={toggle}>{label}</Flex>

      <S.Body
        initial="hidden"
        position={props.position || "right"}
        variants={floatingBodyVariants}
        animate={open ? "visible" : "hidden"}
      >
        {list.map((name) => (
          <S.Item
            key={name}
            initial="hidden"
            variants={simpleVariants}
            active={props.value === name}
            onClick={() =>
              props.onChange ? props.onChange(props.name, name) : null
            }
          >
            {name}
          </S.Item>
        ))}

        {props.children}
      </S.Body>
    </S.StyledDropdown>
  )
}

export default Dropdown
