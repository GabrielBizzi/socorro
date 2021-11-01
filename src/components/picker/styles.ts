import styled, {css} from 'styled-components/native';

import {Picker} from '@react-native-picker/picker';

interface IPickerProps {}

export const Container = styled.View`
  margin-bottom: 8px;
`;

export const ContentTitle = styled.View`
  padding-left: 8px;
  padding-bottom: 6px;
`;

export const Content = styled.View`
  background: #232129;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  padding-right: 32px;
`;

export const PickerComponent = styled(Picker)`
  height: 50px;
  width: 100%;
  color: #ff9000;
`;
