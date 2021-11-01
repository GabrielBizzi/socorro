import React, { useEffect, useState, useCallback } from 'react';
import { Container } from './styles';
import Icon from 'react-native-vector-icons/Feather';
import NetState from '@react-native-community/netinfo';

const Connection = () => {
  const [isConn, setConn] = useState<boolean>(true);
  const [icon, setIcon] = useState<string>('wifi');
  const [color, setColor] = useState<string>('#32cd32');

  const connData = React.useCallback(async () => {
    const ConnData = await NetState.fetch();

    if (ConnData.isConnected) {
      setColor('#32cd32');
      setIcon('wifi');
    } else if (ConnData?.details.strength > 60) {
      setColor('#ff9000');
      setIcon('wifi');
    } else {
      setColor('#f00c');
      setIcon('wifi-off');
    }
  }, []);
  useEffect(() => {
    connData();
    setInterval(connData, 3000);
  }, [connData]);

  return (
    <Container>
      <Icon name={icon} color={color} size={25} />
    </Container>
  );
};

export default Connection;
