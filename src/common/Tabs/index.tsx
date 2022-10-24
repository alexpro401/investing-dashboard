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
    <>
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
      {tabs[activeTab].child}
      <div></div>
    </>
  )
}

export default Tabs
