import { FC, HTMLAttributes } from "react"

import * as S from "./styled"
import { ICON_NAMES } from "consts"
import { v4 as uuidv4 } from "uuid"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const CompletedCard: FC<Props> = ({ ...rest }) => {
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
                  linkIcon={ICON_NAMES.externalLink}
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
        <S.ProgressBar progress={100} />
        <S.Body>
          <S.StatisticItem>
            <S.StatisticItemLabelWrp>
              <S.StatisticItemLabelText>Sale period</S.StatisticItemLabelText>
            </S.StatisticItemLabelWrp>
            <S.StatisticItemValueWrp>
              <S.StatisticItemValueText>
                Jun 22 - Dec 33, 2022
              </S.StatisticItemValueText>
            </S.StatisticItemValueWrp>
          </S.StatisticItem>

          <S.StatisticItem>
            <S.StatisticItemLabelWrp>
              <S.StatisticItemLabelText>Sold</S.StatisticItemLabelText>
            </S.StatisticItemLabelWrp>
            <S.StatisticItemValueWrp>
              <S.StatisticItemValueText>500 DGB</S.StatisticItemValueText>
              <S.StatisticItemValueText color="accent">
                100%
              </S.StatisticItemValueText>
            </S.StatisticItemValueWrp>
          </S.StatisticItem>

          <S.StatisticItem>
            <S.StatisticItemLabelWrp>
              <S.StatisticItemLabelText>
                {"I've Bought"}
              </S.StatisticItemLabelText>
              <S.StatisticTooltip id={uuidv4()}>
                Lorem ipsum dolor sit amet.
              </S.StatisticTooltip>
            </S.StatisticItemLabelWrp>
            <S.StatisticItemValueWrp>
              <S.StatisticItemValueText>100 DGB</S.StatisticItemValueText>
              <S.StatisticItemValueText color="accent">
                20%
              </S.StatisticItemValueText>
            </S.StatisticItemValueWrp>
          </S.StatisticItem>

          <S.StatisticItem>
            <S.StatisticItemLabelWrp>
              <S.StatisticItemLabelText color="error">
                {"I've Bought"}
              </S.StatisticItemLabelText>
              <S.StatisticTooltip id={uuidv4()}>
                Lorem ipsum dolor sit amet.
              </S.StatisticTooltip>
            </S.StatisticItemLabelWrp>
            <S.StatisticItemValueWrp>
              <S.StatisticItemValueText>10,000</S.StatisticItemValueText>
            </S.StatisticItemValueWrp>
          </S.StatisticItem>

          <S.StatisticItem>
            <S.StatisticItemLabelWrp>
              <S.StatisticItemLabelText>Participants</S.StatisticItemLabelText>
              <S.StatisticTooltip id={uuidv4()}>
                Lorem ipsum dolor sit amet.
              </S.StatisticTooltip>
            </S.StatisticItemLabelWrp>
            <S.StatisticItemValueWrp>
              <S.StatisticItemValueText>10,000</S.StatisticItemValueText>
            </S.StatisticItemValueWrp>
          </S.StatisticItem>
        </S.Body>
      </S.Container>
    </S.ContainerWrp>
  )
}

export default CompletedCard
