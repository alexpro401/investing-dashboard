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
  const total = Number(data) || 0

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
    if (offset + limit <= total - limit) {
      setOffset(offset + limit)
    }
  }, [offset, limit, total])

  const dataInView = React.useMemo(() => {
    if (isNil(data)) return null

    return data.slice(offset, offset + limit)
  }, [data, offset, limit])

  const Pagination = React.useMemo(() => {
    if (total <= limit) return null

    return (
      <Flex full ai="center" jc="center" gap="7" m="16px 0 0">
        <S.Title color={theme.textColors.primary}>
          {offset + 1} - {offset + limit} of {total}
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
      {isNil(data) || isEmpty(data) ? (
        <Flex full ai="center" jc="center" p="16px 0 0">
          {!isNil(placeholder) ? (
            placeholder
          ) : (
            <S.Title color={theme.textColors.primary}>No data</S.Title>
          )}
        </Flex>
      ) : (
        map(dataInView, (item, index) => (
          <>
            <Flex full p="16px 0">
              {row(item, index)}
            </Flex>
            <S.Divider />
          </>
        ))
      )}
      {!isNil(nodeFooter) && nodeFooter}
      {pagination && Pagination}
    </div>
  )
}

export default Table
