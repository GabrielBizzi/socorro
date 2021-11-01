import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

export const Container = styled.View`
  background: #312e38;
  width: 100%;
  min-height: 56px;
  align-items: center;
  justify-content: center;
  border-width: ${StyleSheet.hairlineWidth}px;
  flex-direction: row;
`;

export const Text = styled.Text`
  font-family: 'RobotoSlab-regular';
  color: #f4ede8;
  font-size: 14px;
`;

export const Icon = styled(FeatherIcon)`
  margin-right: 16px;
`;
