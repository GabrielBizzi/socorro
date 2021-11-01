import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback } from 'react';
import {
  TouchableNativeFeedback,
  TouchableNativeFeedbackProps,
} from 'react-native';
import { Container, Text, Icon } from './styles';

interface IButton extends TouchableNativeFeedbackProps {
  title: string;
  origin: string;
}

const Footer = ({ origin, title, ...rest }: IButton) => {
  const { navigate } = useNavigation();
  const navigateTo = useCallback(() => {
    navigate(origin);
  }, [navigate, origin]);

  return (
    <TouchableNativeFeedback
      {...rest}
      onPress={navigateTo}
      background={TouchableNativeFeedback.Ripple('white', false)}>
      <Container>
        <Icon name="arrow-left" size={20} color={'#F4EDE8'} />
        <Text>{title}</Text>
      </Container>
    </TouchableNativeFeedback>
  );
};

export default memo(Footer);
