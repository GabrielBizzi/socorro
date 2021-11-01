import styled, {css} from 'styled-components/native';

interface ICard {
  noMargin?: boolean;
}

export const Container = styled.View`
  background-color: #3e3b47;
  border-radius: 10px;
  overflow: hidden;
  ${({noMargin}: ICard) => css`
    margin-left: ${noMargin ? 0 : 16}px;
    margin-right: ${noMargin ? 0 : 16}px;
  `}
`;
