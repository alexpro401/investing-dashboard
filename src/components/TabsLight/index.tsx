import React, { useState, useRef } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

const Container = styled(motion.div)<{ active?: boolean }>`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 40px;
  width: 100%;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: radial-gradient(
        54.8% 53% at 50% 50%,
        #587eb7 0%,
        rgba(88, 126, 183, 0) 100%
      ),
      radial-gradient(
        60% 51.57% at 50% 50%,
        #6d99db 0%,
        rgba(109, 153, 219, 0) 100%
      ),
      radial-gradient(
        69.43% 69.43% at 50% 50%,
        rgba(5, 5, 5, 0.5) 0%,
        rgba(82, 82, 82, 0) 100%
      );
    opacity: 0.1;
  }
`

const Tab = styled(motion.div)<{ active }>`
  height: 40px;
  width: 90px;
  justify-content: center;
  display: flex;
  align-items: center;
  font-family: Gilroy;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 130%;
  text-align: center;
  color: #5a6071;
  position: ${(props) => (props.active ? "relative" : "unset")};
`

const Line = styled.div<{ side: number }>`
  transition: all 0.3s;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 2px;
  width: 90px;
  background: linear-gradient(64.44deg, #63b49b 12.29%, #a4ebd4 76.64%);
  box-shadow: 0px 1px 4px rgba(164, 235, 212, 0.29),
    0px 2px 5px rgba(164, 235, 212, 0.14);
  border-radius: 2px 2px 0px 0px;

  transform: translate(${(props) => (props.side > 0 ? "77px" : "-80px")});
`

const TabsLight: React.FC<{ tabs: { name: string; child: any }[] }> = ({
  tabs,
}) => {
  const [activeTab, setTab] = useState(0)
  return (
    <>
      <Container>
        {tabs.map(({ name }, index) => (
          <Tab
            onClick={() => setTab(index)}
            active={activeTab === index}
            key={name}
          >
            {name}
          </Tab>
        ))}
        <Line side={activeTab} />
      </Container>
      {tabs[activeTab].child}
    </>
  )
}

export default TabsLight
