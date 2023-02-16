import { FC, HTMLAttributes } from "react"

import * as S from "./styled"
import { ICON_NAMES } from "consts"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const ActualCard: FC<Props> = ({ ...rest }) => {
  return (
    <S.ContainerWrp>
      <S.Container isFlatBottomBorders={true} {...rest}>
        <S.ContainerHead
          title={""}
          nodeLeft={
            <S.ContainerNodeLeft>
              <S.DashedBadgeWrp># 3 sale</S.DashedBadgeWrp>
              <S.PricingWrp>
                <S.TokenLinkWrp
                  imgUrl={
                    "https://avatars.githubusercontent.com/u/30753617?s=280&v=4"
                  }
                  text={"1000 DGB"}
                  linkUrl={"#"}
                />
                for
                <S.TokenLinkWrp
                  imgUrl={
                    "https://avatars.githubusercontent.com/u/30753617?s=280&v=4"
                  }
                  linkUrl={"#"}
                />
                <S.TokenLinkWrp
                  imgUrl={
                    "https://avatars.githubusercontent.com/u/30753617?s=280&v=4"
                  }
                  linkUrl={"#"}
                />
                <S.TokenLinkWrp
                  imgUrl={
                    "https://avatars.githubusercontent.com/u/30753617?s=280&v=4"
                  }
                  linkUrl={"#"}
                />
              </S.PricingWrp>
            </S.ContainerNodeLeft>
          }
          nodeRight={
            <S.ContainerNodeRight>
              <S.HeadExplorerLink href={"#"}>
                Link to BSCscan
              </S.HeadExplorerLink>
              <S.HeadProceedToBtn
                text={"Details"}
                iconRight={ICON_NAMES.angleRight}
              />
            </S.ContainerNodeRight>
          }
        />
        <S.ProgressBar progress={50} />
        <S.Body isSplitted={true}>
          <S.BodyLeft>
            <S.InfoTextWrp>
              <S.InfoIcon name={ICON_NAMES.dollarOutline} />
              {"Sell 100,000 / 1,000,000 token (37%)"}
            </S.InfoTextWrp>
          </S.BodyLeft>
          <S.BodyRight>
            <S.InfoTextWrp color="success">
              <S.InfoIcon name={ICON_NAMES.dollarOutline} />
              {"Sell 100,000 / 1,000,000 token (37%)"}
            </S.InfoTextWrp>
          </S.BodyRight>
        </S.Body>
      </S.Container>
      <S.ContainerBottom>Sales end in 20d 20h 20m</S.ContainerBottom>
    </S.ContainerWrp>
  )
}

export default ActualCard
