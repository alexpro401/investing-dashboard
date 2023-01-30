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
import { ICON_NAMES, ZERO } from "consts"
import Switch from "components/Switch"
import { useDispatch } from "react-redux"
import { useEffectOnce } from "react-use"
import { hideTapBar, showTabBar } from "state/application/actions"
import { formatBigNumber, isAddress, shortenAddress } from "utils"

import * as S from "./styled"
import { readFromClipboard } from "utils/clipboard"
import { Bus, sleep } from "helpers"
import { useForm, useFormValidation } from "hooks"
import { required } from "utils/validators"
import { useTraderPoolContract } from "contracts"
import { BigNumber } from "ethers"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const FundDetailsWhitelist: FC<Props> = () => {
  const {
    isPoolPrivate,
    fundAddress,
    whiteList: _whitelist,
    updatePoolInvestors,
  } = useContext(PoolProfileContext)

  const poolContract = useTraderPoolContract(fundAddress)

  const [isWhiteListEnabled, setIsWhitelistEnabled] = useState(!!isPoolPrivate)

  const [whitelist, setWhitelist] = useState<
    {
      isDisabled: boolean
      address: string
      balance: BigNumber
    }[]
  >([])

  const setDefaultFundInvestors = useCallback(async () => {
    if (!_whitelist) return

    const whiteListWithBalances = await Promise.all(
      _whitelist.map(async (el) => ({
        isDisabled: false,
        address: el.id,
        balance: (await poolContract?.balanceOf(el.id)) || ZERO,
      }))
    )

    setWhitelist(whiteListWithBalances)
  }, [_whitelist, poolContract])

  useEffectOnce(() => {
    setDefaultFundInvestors()
  })

  const dispatch = useDispatch()

  const { disableForm, enableForm, isFormDisabled } = useForm()
  const { getFieldErrorMessage, touchField, touchForm, isFieldsValid } =
    useFormValidation(
      {
        whitelist,
      },
      {
        whitelist: {
          $every: {
            address: {
              required,
            },
          },
        },
      }
    )

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
          balance: ZERO,
        },
      ]
    })
  }, [whitelist])

  const WhiteListCollapse = useMemo(() => {
    return (
      <Collapse isOpen={isWhiteListEnabled}>
        <Card>
          <CardHead
            title={`Addresses: ${whitelist?.length || 0}`}
            nodeRight={
              <S.HeadResetBtn
                text={"Delete available"}
                onClick={() => setDefaultFundInvestors()}
                disabled={isFormDisabled}
              />
            }
          />
          <CardFormControl>
            <S.AddressBalanceAddBtn
              onClick={handleAddItemToWhitelist}
              disabled={isFormDisabled}
            >
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
                balanceValue={formatBigNumber(item.balance)}
                tokenSymbol={"ETH"}
                errorMessage={getFieldErrorMessage(`whitelist[${idx}]`)}
                onBlur={() => touchField(`whitelist[${idx}]`)}
                disabled={isFormDisabled}
              />
            ))}
          </CardFormControl>
        </Card>
      </Collapse>
    )
  }, [
    getFieldErrorMessage,
    handleAddItemToWhitelist,
    isFormDisabled,
    isWhiteListEnabled,
    setDefaultFundInvestors,
    touchField,
    whitelist,
  ])

  const submit = useCallback(async () => {
    touchForm()
    await sleep(100)
    if (!updatePoolInvestors || !isFieldsValid) return

    disableForm()

    try {
      await updatePoolInvestors(
        whitelist?.map((el) => ({
          address: el.address,
          isDisabled: el.isDisabled,
        }))
      )

      Bus.emit("manage-modal/menu")
    } catch (error) {
      console.log(error)
    }

    enableForm()
  }, [
    disableForm,
    enableForm,
    isFieldsValid,
    touchForm,
    updatePoolInvestors,
    whitelist,
  ])

  return (
    <>
      <Card>
        <CardHead
          nodeLeft={<Icon name={ICON_NAMES.usersGroup} />}
          title="Limit who can invest"
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
            Вы можете сделать ваш пул приватным, добавив определенные адреса.
            Вайтлистом можно будет управлять позже. Так же вы можете вкл/выкл
            эту фичу в любой момент.
          </p>
        </CardDescription>
      </Card>
      {WhiteListCollapse}
      <S.FormSubmitBtn
        text="Confirm changes"
        onClick={submit}
        disabled={isFormDisabled}
      />
    </>
  )
}

export default FundDetailsWhitelist
