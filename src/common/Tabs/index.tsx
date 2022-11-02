import { FC, ReactNode, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import * as S from "./styled"

interface ITab {
  name: ReactNode
  child: ReactNode
}

interface IProps {
  tabs: Array<ITab>
  gap?: number
}

const Tabs: FC<IProps> = ({ tabs, gap }) => {
  const [activeTab, setTab] = useState(0)

  return (
    <S.Container>
      <S.List count={tabs.length} gap={gap}>
        {tabs.map(({ name }, index) => {
          return (
            <S.Tab
              onClick={() => setTab(index)}
              active={activeTab === index}
              key={uuidv4()}
            >
              {name}
            </S.Tab>
          )
        })}
      </S.List>
      <S.Content>{tabs[activeTab].child}</S.Content>
    </S.Container>
  )
}

export default Tabs
