import { FC, useRef } from "react"

import { ICON_NAMES, sortItemsList } from "consts"
import { useDispatch, useSelector } from "react-redux"

import { AppDispatch } from "state"
import { selectPoolsFilters } from "state/pools/selectors"
import { ISortItem } from "interfaces"
import { setFilter } from "state/pools/actions"

import SortIcon from "assets/icons/SortIcon"

import * as S from "./styled"
import { useClickAway } from "react-use"
import { MotionProps } from "framer-motion"

const getDirection = (direction: "asc" | "desc" | "") => {
  switch (direction) {
    case "desc":
      return "asc"

    case "asc":
      return "desc"

    default:
      return "desc"
  }
}

interface Props extends MotionProps {
  isOpen: boolean
  handleClose: () => void
}

const TradersSort: FC<Props> = ({ isOpen, handleClose, ...rest }) => {
  const sortRootRef = useRef<HTMLDivElement>(null)

  const dispatch = useDispatch<AppDispatch>()

  const filters = useSelector(selectPoolsFilters)

  const handleSortClick = (item: ISortItem) => {
    const isSameSort = filters.sort.key === item.key
    const direction = isSameSort ? getDirection(filters.sort.direction) : "desc"

    dispatch(
      setFilter({
        name: "sort",
        value: { ...item, direction },
      })
    )
  }

  const handleCancelClick = () => {
    dispatch(
      setFilter({
        name: "sort",
        value: sortItemsList[0],
      })
    )
  }

  useClickAway(sortRootRef, () => {
    handleClose()
  })

  return (
    <S.Container
      ref={sortRootRef}
      animate={isOpen ? "visible" : "hidden"}
      initial="hidden"
      variants={{
        visible: {
          opacity: 1,
          y: 0,
          display: "block",
          transition: { duration: 0.1 },
        },
        hidden: {
          opacity: 0,
          y: -15,
          transition: { duration: 0.1 },
          transitionEnd: { display: "none" },
        },
      }}
      {...rest}
    >
      <S.Header>
        <S.Title>Sort traders:</S.Title>
        <S.Cancel
          color="secondary"
          size="no-paddings"
          iconRight={ICON_NAMES.close}
          onClick={handleClose}
        />
      </S.Header>
      {sortItemsList.map((item) => (
        <S.Item
          active={item.key === filters.sort.key}
          onClick={() => handleSortClick(item)}
          key={item.key}
        >
          <S.Label active={item.key === filters.sort.key}>{item.label}</S.Label>
          <SortIcon
            direction={
              item.key === filters.sort.key ? filters.sort.direction : ""
            }
          />
        </S.Item>
      ))}
      <S.Footer>
        <S.FooterBtn
          color="secondary"
          text="Clear All"
          size="small"
          onClick={handleCancelClick}
        />
        <S.FooterBtn text="Done" size="small" onClick={handleClose} />
      </S.Footer>
    </S.Container>
  )
}

export default TradersSort
