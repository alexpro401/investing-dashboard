import { useCallback, useMemo, useState } from "react"
import { AppButton, Icon } from "common"
import Checkbox from "components/Checkbox"
import { ICON_NAMES, ROUTE_PATHS } from "consts"
import { Flex } from "theme"
import FaqText from "./content"
import * as S from "pages/CreateRiskyProposal/styled"
import { generatePath, useNavigate, useParams } from "react-router-dom"

const Faq = () => {
  const { poolAddress } = useParams()
  const navigate = useNavigate()
  const DO_NOT_SHOW_AGAIN =
    localStorage.getItem("invest-proposal-faq-read") === "true"

  const [isChecked, setChecked] = useState(DO_NOT_SHOW_AGAIN)

  const handleCheckboxChange = useCallback(() => {
    setChecked(!isChecked)

    if (!isChecked) {
      localStorage.setItem("invest-proposal-faq-read", "true")
    } else {
      localStorage.setItem("invest-proposal-faq-read", "false")
    }
  }, [isChecked])

  const returnPath = useMemo(() => {
    return generatePath(ROUTE_PATHS.poolSwap, {
      poolAddress: poolAddress!,
      inputToken: "0x",
      outputToken: "0x",
      "*": "",
    })
  }, [poolAddress])

  const continuePath = useMemo(() => {
    if (!poolAddress) return ""

    return generatePath(ROUTE_PATHS.investmentProposalCreate, {
      poolAddress,
      "*": "create",
    })
  }, [poolAddress])

  return (
    <S.Container>
      <S.Header>
        <S.Title>How a investment proposal works ?</S.Title>
        <Icon
          style={{ cursor: "pointer" }}
          name={ICON_NAMES.modalClose}
          onClick={() =>
            navigate(
              generatePath(ROUTE_PATHS.poolProfile, {
                poolAddress: poolAddress!,
                "*": "",
              })
            )
          }
        />
      </S.Header>
      <S.Body>{FaqText}</S.Body>
      <S.Footer>
        <Flex full jc="flex-start" p="16px 16px 0">
          <Checkbox
            label={
              <S.CheckboxLabel>
                Don&apos;t show me this message again
              </S.CheckboxLabel>
            }
            name="dont-show-risky-proposal-faq"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
        </Flex>
        <S.Buttons>
          <AppButton
            routePath={returnPath}
            text="Return"
            size="small"
            color="secondary"
            full
          />
          <AppButton
            routePath={continuePath}
            text="Continue"
            size="small"
            color="primary"
            full
          />
        </S.Buttons>
      </S.Footer>
    </S.Container>
  )
}

export default Faq
