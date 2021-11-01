import styled, {css} from 'styled-components/native';

interface IButton {
  width?: number;
  height?: number;
  noRadius?: boolean;
  noAlignItem?: boolean;
  flex?: boolean;
  disabled?: boolean;
  background?: string;
}

export const Container = styled.View`
  ${({width, height, noRadius, disabled, background}: IButton) => css`
    width: ${width ? width : 100}%;
    border-radius: ${noRadius ? 0 : 12}px;
    background: ${disabled ? '#F2BA72' : background ? background :'#ff9000'};
    height: ${height ? height : 50}px;
  `}
  align-items: center;
  justify-content: center;
  padding: 8px;
  flex-direction: row;
`;

export const Text = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #312e38;
  font-size: 14px;
`;

export const ContentButton = styled.View`
  ${({width, noRadius, noAlignItem, flex}: IButton) => css`
    flex: ${flex ? 1 : 'auto'};
    align-items: ${noAlignItem ? 'baseline' : 'center'};
    width: ${width ? width : 100}%;
    border-radius: ${noRadius ? 0 : 12}px;
  `}
  overflow: hidden;
`;
