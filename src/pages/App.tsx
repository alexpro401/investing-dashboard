import Div100vh from "react-div-100vh"
import theme from "theme"
import { ThemeProvider } from "styled-components/macro"
import { ModalProvider } from "styled-react-modal"
import UnsupportedChain from "components/UnsupportedChain"

import { useEagerConnect } from "hooks"
import { useInactiveListener } from "hooks/useInactiveListener"

import ConnectWalletContext from "context/ConnectWalletContext"

import NotificationsContext from "context/NotificationsContext"

import Routes from "pages/Routes"

import { SpecialModalBackground, AppWrapper } from "theme/GlobalStyle"
import useIosHeightFix from "utils/useIosHeightFix"
import InfoAccordion from "components/InfoAccordion"

const App = () => {
  const eager = useEagerConnect()
  useInactiveListener(eager)
  useIosHeightFix()

  return (
    <ThemeProvider theme={theme}>
      <ModalProvider backgroundComponent={SpecialModalBackground}>
        <UnsupportedChain />
        <Div100vh>
          <AppWrapper>
            <ConnectWalletContext>
              <NotificationsContext>
                <InfoAccordion
                  rows={[
                    {
                      title: "Title 1",
                      tooltip: "Tooltip 1",
                      value: "Value 1",
                      pnl: "0.00",
                      childrens: [
                        {
                          title: "Title 1.1",
                          tooltip: "Tooltip 1.1",
                          value: "Value 1.1",
                          pnl: "0.00",
                        },
                        {
                          title: "Title 1.2",
                          tooltip: "Tooltip 1.2",
                          value: "Value 1.2",
                          pnl: "0.00",
                        },
                      ],
                    },
                    {
                      title: "Title 2",
                      tooltip: "Tooltip 2",
                      value: "Value 2",
                      pnl: "0.00",
                    },
                  ]}
                />
                {/* <Routes /> */}
              </NotificationsContext>
            </ConnectWalletContext>
          </AppWrapper>
        </Div100vh>
      </ModalProvider>
    </ThemeProvider>
  )
}

export default App
