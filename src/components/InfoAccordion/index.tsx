import { isArray } from "lodash"
import React, { FC, ReactNode } from "react"
import Row from "./Row"
import * as S from "./styled"

export interface Info {
  title: string
  tooltip?: ReactNode
  rightNode?: ReactNode
  value: string
  pnl?: string
  childrens?: Info[] | JSX.Element[]
}

interface Props {
  rows: Info[]
}

const InfoAccordion: FC<Props> = ({ rows }) => {
  return (
    <S.Container>
      {rows.map((row) => (
        <Row key={row.title} data={row}>
          {row.childrens && (
            <>
              {isArray(row.childrens) &&
                row.childrens.map((child) =>
                  React.isValidElement(child) ? (
                    child
                  ) : (
                    <Row key={child.title} data={child} />
                  )
                )}
            </>
          )}
        </Row>
      ))}
    </S.Container>
  )
}

export default InfoAccordion
