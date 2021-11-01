import styled, { css } from 'styled-components/native';

interface IMarkdownStyled {
  fontWeight?: 400 | 500 | 700;
  type?: 'title' | 'subtitle';
  color?: string;
  align?: string;
}

export const MarkdownText = styled.Text`
  ${(props: IMarkdownStyled) => css`
    font-family: ${props.fontWeight === 500 || props.type === 'title'
      ? 'RobotoSlab-Medium'
      : props.fontWeight === 700
      ? 'RobotoSlab-Bold'
      : 'RobotoSlab-Regular'};
    color: ${props.color ? props.color : '#F4EDE8'};
    font-size: ${props.type === 'title'
      ? 20
      : props.type === 'subtitle'
      ? 14
      : 16}px;
    text-align: ${props.align ? props.align : 'center'};
  `}
`;
