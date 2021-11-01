import React, { memo, useCallback, useRef, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from 'navigation/interfaces';
import { StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Container, Content } from './styles';

const Camera = () => {
  const cameraRef = useRef(null);
  const { navigate } = useNavigation();
  const [pageReady, setOnPageReady] = useState(false);
  const { params } = useRoute<RouteProp<RootStackParamList, 'CameraScreen'>>();

  const handleSubmitOrder = useCallback(
    (event) => {
      if (params.origin === 'StorageScreen') {
        navigate('StorageScreen', {
          order: event.data,
          input: params.input,
        });
      }
      if (params.origin === 'QueryScreen') {
        navigate('QueryScreen', {
          order: event.data,
        });
      }
      if (params.origin === 'AddressScreen') {
        navigate('AddressScreen', {
          order: event.data,
        });
      }
    },
    [navigate, params.origin],
  );

  return (
    <Container
      onLayout={() =>
        setTimeout(() => {
          setOnPageReady(true);
        }, 300)
      }>
      <Content>
        {pageReady && (
          <RNCamera
            style={styles.rnCamera}
            ref={cameraRef}
            flashMode="auto"
            type="back"
            captureAudio={false}
            onBarCodeRead={handleSubmitOrder}
          />
        )}
      </Content>
    </Container>
  );
};

export default memo(Camera);

const styles = StyleSheet.create({
  rnCamera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
