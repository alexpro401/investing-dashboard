import {
  FC,
  HTMLAttributes,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { PoolProfileContext } from "pages/PoolProfile/context"

import * as S from "./styled"
import { useDispatch } from "react-redux"
import { useEffectOnce } from "react-use"
import { hideTapBar, showTabBar } from "state/application/actions"
import { readFromClipboard } from "utils/clipboard"
import { isAddress, shortenAddress } from "utils"
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

interface Props extends HTMLAttributes<HTMLDivElement> {}

const FundDetailsManager: FC<Props> = () => {
  const {} = useContext(PoolProfileContext)

  const [isFundManagersEnabled, setIsFundManagersEnabled] = useState(true)

  const [fundManagers, setFundManagers] = useState<
    {
      isDisabled: boolean
      address: string
    }[]
  >([])

  const dispatch = useDispatch()

  useEffectOnce(() => {
    dispatch(hideTapBar())

    return () => {
      dispatch(showTabBar())
    }
  })

  const handleAddItemToFundManagers = useCallback(async () => {
    const textFromClipboard = await readFromClipboard()

    if (
      !textFromClipboard ||
      !isAddress(textFromClipboard) ||
      fundManagers
        .map((el) => el.address.toLowerCase())
        .includes(textFromClipboard.toLowerCase())
    )
      return

    setFundManagers((prev) => {
      return [
        ...prev,
        {
          isDisabled: false,
          address: textFromClipboard,
          balance: "",
        },
      ]
    })
  }, [fundManagers])

  const FundManagersCollapse = useMemo(() => {
    return (
      <Collapse isOpen={isFundManagersEnabled}>
        <Card>
          <CardHead
            title={`Addresses: ${fundManagers?.length || 0}`}
            nodeRight={
              <S.HeadResetBtn
                text={"Delete all"}
                onClick={() => setFundManagers([])}
              />
            }
          />
          <CardFormControl>
            <S.AddressBalanceAddBtn onClick={handleAddItemToFundManagers}>
              Paste address
            </S.AddressBalanceAddBtn>
            {fundManagers.map((item, idx) => (
              <S.AddressBalanceFieldWrp
                key={idx}
                addressValue={shortenAddress(item.address)}
                updateAddressValue={(v) =>
                  setFundManagers((prev) => {
                    const newWhitelist = [...prev]
                    newWhitelist[idx].address = v

                    return newWhitelist
                  })
                }
                onFilledNodeLeft={
                  item.isDisabled ? (
                    <S.RefreshBtnIcon
                      onClick={() => {
                        setFundManagers((prev) => {
                          const newWhitelist = [...prev]
                          newWhitelist[idx].isDisabled = false

                          return newWhitelist
                        })
                      }}
                    />
                  ) : (
                    <S.DisableBtnIcon
                      onClick={() => {
                        setFundManagers((prev) => {
                          const newWhitelist = [...prev]
                          newWhitelist[idx].isDisabled = true

                          return newWhitelist
                        })
                      }}
                    />
                  )
                }
                isItemDisabled={item.isDisabled}
              />
            ))}
          </CardFormControl>
        </Card>
      </Collapse>
    )
  }, [handleAddItemToFundManagers, isFundManagersEnabled, fundManagers])

  return (
    <>
      <Card>
        <CardHead
          nodeLeft={<Icon name={ICON_NAMES.users} />}
          title="Fund managers"
          nodeRight={
            <Switch
              isOn={isFundManagersEnabled}
              onChange={(n, v) => {
                setIsFundManagersEnabled(v)
              }}
              name={"is-whitelist-enabled"}
            />
          }
        />
        <CardDescription>
          <p>
            Менеджеры фонда имееют такие же права как у вас, кроме открытыия
            риск пропозалов. Максимум 5 адрессов.
          </p>
        </CardDescription>
      </Card>
      {FundManagersCollapse}
      <S.FormSubmitBtn text="Confirm changes" />
    </>
  )
}

export default FundDetailsManager
