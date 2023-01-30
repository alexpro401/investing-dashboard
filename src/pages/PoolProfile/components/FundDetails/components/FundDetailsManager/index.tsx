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
import { useForm, useFormValidation } from "hooks"
import { required } from "utils/validators"
import { Bus, sleep } from "helpers"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const FundDetailsManager: FC<Props> = () => {
  const { fundManagers: _fundManagers, updatePoolManagers } =
    useContext(PoolProfileContext)

  const [isFundManagersEnabled, setIsFundManagersEnabled] = useState(
    !!_fundManagers?.length
  )

  const [fundManagers, setFundManagers] = useState<
    {
      isDisabled: boolean
      address: string
    }[]
  >([])

  const setDefaultFundManagers = useCallback(() => {
    setFundManagers([
      ...(_fundManagers?.map((el) => ({ isDisabled: false, address: el })) ||
        []),
    ])
  }, [_fundManagers])

  useEffectOnce(() => {
    setDefaultFundManagers()
  })

  const { disableForm, enableForm, isFormDisabled } = useForm()
  const { getFieldErrorMessage, touchField, touchForm, isFieldsValid } =
    useFormValidation(
      {
        fundManagers,
      },
      {
        fundManagers: {
          $every: {
            address: {
              required,
            },
          },
        },
      }
    )

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
                onClick={() => setDefaultFundManagers()}
                disabled={isFormDisabled}
              />
            }
          />
          <CardFormControl>
            <S.AddressBalanceAddBtn
              onClick={handleAddItemToFundManagers}
              disabled={isFormDisabled}
            >
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
                errorMessage={getFieldErrorMessage(
                  `fundManagers[${idx}].address`
                )}
                onBlur={() => touchField(`fundManagers[${idx}].address`)}
                disabled={isFormDisabled}
              />
            ))}
          </CardFormControl>
        </Card>
      </Collapse>
    )
  }, [
    isFundManagersEnabled,
    fundManagers,
    isFormDisabled,
    handleAddItemToFundManagers,
    setDefaultFundManagers,
    getFieldErrorMessage,
    touchField,
  ])

  const submit = useCallback(async () => {
    touchForm()
    await sleep(100)
    if (!updatePoolManagers || !isFieldsValid) return

    disableForm()

    try {
      await updatePoolManagers(fundManagers)

      Bus.emit("manage-modal/menu")
    } catch (error) {
      console.log(error)
    }

    enableForm()
  }, [
    disableForm,
    enableForm,
    fundManagers,
    isFieldsValid,
    touchForm,
    updatePoolManagers,
  ])

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
      <S.FormSubmitBtn
        text="Confirm changes"
        onClick={submit}
        disabled={isFormDisabled}
      />
    </>
  )
}

export default FundDetailsManager
