import styled from "styled-components"
import theme from "theme"

export const Page404Container = styled.main`
  width: 100%;
  padding: 20px;
`

export const Page404Content = styled.section`
  margin: 0 auto;
  background-color: ${theme.backgroundColors.light};
  padding: 20px;
  border-radius: 16px;
`

export const Page404Title = styled.h2`
  text-align: center;
  color: ${theme.textColors.primary};
  font-weight: 600;
  font-size: 20px;
`

export const Page404ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`

export const Page404TextContainer = styled.section`
  text-align: center;
`

export const Page404Text = styled.span`
  color: ${theme.textColors.primary};
  font-weight: 500;
  font-size: 13px;
  line-height: 150%;
`
