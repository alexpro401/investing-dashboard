import {
  FC,
  HTMLAttributes,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { PoolProfileContext } from "pages/PoolProfile/context"
import {
  Card,
  CardDescription,
  CardFormControl,
  CardHead,
  Collapse,
  Icon,
} from "common"
import { ICON_NAMES } from "consts"
import Switch from "components/Switch"
import { useDispatch } from "react-redux"
import { useEffectOnce } from "react-use"
import { hideTapBar, showTabBar } from "state/application/actions"
import { isAddress, shortenAddress } from "utils"

import * as S from "./styled"
import { readFromClipboard } from "utils/clipboard"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const FundDetailsWhitelist: FC<Props> = () => {
  const {} = useContext(PoolProfileContext)

  const [isWhiteListEnabled, setIsWhitelistEnabled] = useState(true)

  const [whitelist, setWhitelist] = useState<
    {
      isDisabled: boolean
      address: string
      balance: string
    }[]
  >([])

  const dispatch = useDispatch()

  useEffectOnce(() => {
    dispatch(hideTapBar())

    return () => {
      dispatch(showTabBar())
    }
  })

  const handleAddItemToWhitelist = useCallback(async () => {
    const textFromClipboard = await readFromClipboard()

    if (
      !textFromClipboard ||
      !isAddress(textFromClipboard) ||
      whitelist
        .map((el) => el.address.toLowerCase())
        .includes(textFromClipboard.toLowerCase())
    )
      return

    setWhitelist((prev) => {
      return [
        ...prev,
        {
          isDisabled: false,
          address: textFromClipboard,
          balance: "",
        },
      ]
    })
  }, [whitelist])

  const WhiteListCollapse = useMemo(() => {
    return (
      <Collapse isOpen={isWhiteListEnabled}>
        <Card>
          <CardHead
            nodeLeft={<Icon name={ICON_NAMES.dollarOutline} />}
            title="Min Investment Amount"
            nodeRight={
              <S.HeadResetBtn
                text={"Delete available"}
                onClick={() => setWhitelist([])}
              />
            }
          />
          <CardFormControl>
            <S.AddressBalanceAddBtn onClick={handleAddItemToWhitelist}>
              Paste address
              <S.AddressBalanceAddBtnStubWrp>
                <S.AddressBalanceAddBtnInputStub>
                  0,00
                </S.AddressBalanceAddBtnInputStub>
                <S.AddressBalanceAddBtnSymbolStub>
                  TKN
                </S.AddressBalanceAddBtnSymbolStub>
              </S.AddressBalanceAddBtnStubWrp>
            </S.AddressBalanceAddBtn>
            {whitelist.map((item, idx) => (
              <S.AddressBalanceFieldWrp
                key={idx}
                addressValue={shortenAddress(item.address)}
                updateAddressValue={(v) =>
                  setWhitelist((prev) => {
                    const newWhitelist = [...prev]
                    newWhitelist[idx].address = v

                    return newWhitelist
                  })
                }
                onFilledNodeLeft={
                  item.isDisabled ? (
                    <S.RefreshBtnIcon
                      onClick={() => {
                        setWhitelist((prev) => {
                          const newWhitelist = [...prev]
                          newWhitelist[idx].isDisabled = false

                          return newWhitelist
                        })
                      }}
                    />
                  ) : (
                    <S.DisableBtnIcon
                      onClick={() => {
                        setWhitelist((prev) => {
                          const newWhitelist = [...prev]
                          newWhitelist[idx].isDisabled = true

                          return newWhitelist
                        })
                      }}
                    />
                  )
                }
                isItemDisabled={item.isDisabled}
                balanceValue={item.balance}
                updateBalanceValue={(v) => {
                  setWhitelist((prev) => {
                    const newWhitelist = [...prev]
                    newWhitelist[idx].balance = v
                    return newWhitelist
                  })
                }}
                tokenSymbol={"ETH"}
              />
            ))}
          </CardFormControl>
        </Card>
      </Collapse>
    )
  }, [handleAddItemToWhitelist, isWhiteListEnabled, whitelist])

  return (
    <>
      <Card>
        <CardHead
          nodeLeft={<Icon name={ICON_NAMES.dollarOutline} />}
          title="Min Investment Amount"
          nodeRight={
            <Switch
              isOn={isWhiteListEnabled}
              onChange={(n, v) => {
                setIsWhitelistEnabled(v)
              }}
              name={"is-whitelist-enabled"}
            />
          }
        />
        <CardDescription>
          <p>
            Вы можете ограничить минимальную инвестицию в ваш фонд. Это можно
            менять в любой момент
          </p>
        </CardDescription>
      </Card>
      {WhiteListCollapse}
      <S.FormSubmitBtn text="Confirm changes" />
    </>
  )
}

export default FundDetailsWhitelist
