import styled from "styled-components"

const GridContainer = styled.div`
  height: fill-available;
  overflow: auto;
  width: fill-available;
  max-width: 900px;
  padding: 50px 0;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 32px 32px;
  grid-template-areas:
    ". . ."
    ". . ."
    ". . .";
`

const Tile = styled.div`
  display: flex;
  flex-direction: column;
`

const Label = styled.div`
  margin-bottom: 30px;
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 150%;
  color: #b1c7fc;
`

const Grid = ({ items }) => {
  return (
    <GridContainer>
      {items.map((item, index) => {
        return (
          <Tile key={index}>
            <Label>{item.name}</Label>
            {item.content}
          </Tile>
        )
      })}
    </GridContainer>
  )
}

export default Grid
