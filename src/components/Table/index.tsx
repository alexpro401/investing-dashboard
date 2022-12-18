import * as React from "react"
import { isEmpty, isNil, map } from "lodash"

import * as S from "./styled"
import theme, { Flex } from "theme"
import { ICON_NAMES } from "constants/icon-names"

interface Props {
  nodeHead?: React.ReactNode
  nodeFooter?: React.ReactNode
  row: (item: any, i: number) => React.ReactNode
  data: any[]
  pagination?: boolean
  placeholder?: React.ReactNode
}

const Table: React.FC<Props> = ({
  nodeHead,
  data,
  row,
  nodeFooter,
  pagination = true,
  placeholder,
}) => {
  const total = Number(data.length) || 0

  const [offset, setOffset] = React.useState(0)
  const [limit, setLimit] = React.useState(10)

  const onPrev = React.useCallback(() => {
    if (offset === 0 || offset - limit <= 0) {
      setOffset(0)
    } else {
      setOffset(offset - limit)
    }
  }, [offset, limit])

  const onNext = React.useCallback(() => {
    if (offset + limit <= total) {
      setOffset(offset + limit)
    }
  }, [offset, limit, total])

  const dataInView = React.useMemo(() => {
    if (isNil(data)) return null

    return data.slice(offset, offset + limit)
  }, [data, offset, limit])

  const Pagination = React.useMemo(() => {
    if (total <= limit) return null

    const end = offset + limit <= total ? offset + limit : total

    return (
      <>
        <S.Divider />
        <Flex full ai="center" jc="center" gap="7" m="16px 0 0">
          <S.Title color={theme.textColors.primary}>
            {offset + 1} - {end} of {total}
          </S.Title>
          <Flex ai="center" jc="center" gap="16">
            <S.NavButton
              iconLeft={ICON_NAMES.angleLeft}
              onClick={onPrev}
              disabled={offset === 0}
            />
            <S.NavButton
              iconRight={ICON_NAMES.angleRight}
              onClick={onNext}
              disabled={offset + limit >= total}
            />
          </Flex>
        </Flex>
      </>
    )
  }, [total, limit, offset])

  return (
    <div>
      {!isNil(nodeHead) && (
        <>
          <Flex full m={"0 0 16px"} dir={"column"}>
            {nodeHead}
          </Flex>
          <S.Divider />
        </>
      )}
      {isNil(dataInView) || isEmpty(dataInView) ? (
        <Flex full ai="center" jc="center" p="16px 0 0">
          {!isNil(placeholder) ? (
            placeholder
          ) : (
            <S.Title color={theme.textColors.primary}>No data</S.Title>
          )}
        </Flex>
      ) : (
        map(dataInView, (item, index) => (
          <React.Fragment key={index}>
            <Flex full p="16px 0">
              {row(item, index)}
            </Flex>
            {index + 1 < dataInView.length ? <S.Divider /> : null}
          </React.Fragment>
        ))
      )}
      {!isNil(nodeFooter) && nodeFooter}
      {pagination && Pagination}
    </div>
  )
}

export default Table
