import styled, {css} from 'styled-components/native';

interface IModal {
  noPadding?: boolean;
}

const Container = styled.View`
  ${(props: IModal) => css`
    padding: ${props.noPadding ? 0 : 16}px;
  `}
  width: 100%;
  background-color: white;
  align-items: center;
  border-radius: 16px;
  overflow: hidden;
`;

export {Container};
