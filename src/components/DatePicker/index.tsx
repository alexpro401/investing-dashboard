import Calendar from "react-calendar"
import { createPortal } from "react-dom"
import { format, getHours, getMinutes } from "date-fns/esm"

import { modalContainerVariants } from "motion/variants"
import { keepHoursAndMinutes } from "utils"
import { Flex } from "theme"

import { Container, TimeLabel, TimeInput, Overlay } from "./styled"
import "./styles.css"

const modalRoot = document.getElementById("modal")

interface Props {
  isOpen: boolean
  timestamp: number
  toggle: () => void
  onChange: (timestamp: number) => void
  minDate?: Date
  maxDate?: Date
}

const DatePicker: React.FC<Props> = ({
  isOpen,
  timestamp,
  onChange,
  toggle,
  minDate,
  maxDate,
}) => {
  const handleDateChange = (date: Date) => {
    const hh = getHours(timestamp)
    const mm = getMinutes(timestamp)

    const newTimestamp = keepHoursAndMinutes(date, hh, mm)

    onChange(newTimestamp)
  }

  const handleTimeChange = (e) => {
    const time = e.target.value.split(":")

    const newTimestamp = keepHoursAndMinutes(timestamp, time[0], time[1])

    onChange(newTimestamp)
  }

  if (!modalRoot) return null

  return createPortal(
    <>
      <Overlay
        onClick={toggle}
        animate={isOpen ? "visible" : "hidden"}
        initial="hidden"
        variants={{
          visible: {
            opacity: 0.9,
            display: "block",
          },
          hidden: {
            opacity: 0,
            transitionEnd: { display: "none" },
          },
        }}
      />
      <Container
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        variants={modalContainerVariants}
      >
        <Calendar
          onChange={handleDateChange}
          value={new Date(timestamp)}
          minDate={minDate}
          maxDate={maxDate}
        />
        <Flex p="17px 0 0 4px" full>
          <TimeLabel>Time: </TimeLabel>
          <TimeInput
            onChange={handleTimeChange}
            type="time"
            id="appt"
            name="appt"
            min="00:00"
            max="23:59"
            value={format(timestamp, "HH:mm")}
          />
        </Flex>
      </Container>
    </>,
    modalRoot
  )
}

export default DatePicker
