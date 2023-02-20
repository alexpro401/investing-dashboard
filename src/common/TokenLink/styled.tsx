import { Icon } from "common"

import styled from "styled-components/macro"

export const Container = styled.div`
  position: relative;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 2px;
`

export const TokenImage = styled.img`
  width: clamp(24px, 24px, 24px);
  height: clamp(24px, 24px, 24px);
  margin-right: 2px;
`

export const TokenText = styled.span`
  color: inherit;
  font-size: 16px;
  line-height: 1.25;
  font-weight: 700;
  letter-spacing: 0.01em;
`

export const LinkIcon = styled(Icon)`
  color: inherit;
  width: 1.1em;
  height: 1.1em;
  transform: translateY(-2px); // FIXME: temp
`

export const Link = styled.a`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`
