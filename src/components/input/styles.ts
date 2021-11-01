import styled, { css } from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';

interface ContainerProps {
  isFocused: boolean;
  isErrored: boolean;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  height: 50px;
  padding: 0 16px;
  background: #232129;
  border-radius: 10px;
  margin-bottom: 8px;
  border-width: 2px;
  border-color: #232129;

  flex-direction: row;
  align-items: center;

  ${(props) =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}

  ${(props) =>
    props.isFocused &&
    css`
      border-color: #ff9000;
    `}
`;

export const LabelContainer = styled.View`
  justify-content: flex-start;
  width: 100%;
  padding-left: 10px;
  padding-bottom: 4px;
`;

export const TextInput = styled.TextInput.attrs((props: any) => ({
  placeholderTextColor: props.placeholderTextColor
    ? props.placeholderTextColor
    : 'rgba(244, 237, 232, 0.7)',
}))`
  flex: 1;
  color: #fff;
  font-size: 16px;
  font-family: 'RobotoSlab-Regular';
`;

export const IconFeather = styled(FeatherIcon)`
  margin-right: 16px;
`;

export const IconAwesome = styled(AwesomeIcon)`
  margin-right: 16px;
`;
