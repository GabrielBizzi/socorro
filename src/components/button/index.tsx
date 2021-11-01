import React, {memo, ReactNode} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';
import {Container, ContentButton} from './styles';
import {TouchableNativeFeedbackProps} from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import Markdown from '../markdown';

interface IButton extends TouchableNativeFeedbackProps {
  width?: number;
  height?: number;
  value: string;
  color?: string;
  disable?: boolean;
  loading?: boolean;
  typeFont?: 'title' | 'subtitle';
  leadingIcon?: ReactNode;
  fontWeight?: 400 | 500 | 700;
  noRadius?: boolean;
  noAlignItem?: boolean;
  flex?: boolean;
  background?: string;
}

const Button = ({
  width,
  height,
  value,
  color,
  typeFont,
  loading,
  leadingIcon,
  fontWeight,
  background,
  noRadius,
  noAlignItem,
  disable,
  flex,
  ...rest
}: IButton) => {
  return (
    <ContentButton
      noRadius={noRadius}
      flex={flex}
      width={width}
      height={height}
      noAlignItem={noAlignItem}>
      <TouchableNativeFeedback
        {...rest}
        background={TouchableNativeFeedback.Ripple('white', false)}>
        <Container background={background} disabled={disable} noRadius={noRadius} width={width}>
          {loading && <ActivityIndicator size="small" color="#312e38" />}
          {leadingIcon && !loading && (
            <Icons
              name="plus-square"
              style={styles.icon}
              size={25}
              color="black"
            />
          )}
          {!loading && (
            <Markdown
              type={typeFont}
              fontWeight={fontWeight}
              color={disable ? '#8A898E' : color ? color : '#312E38'}
              value={value}
            />
          )}
        </Container>
      </TouchableNativeFeedback>
    </ContentButton>
  );
};

export default memo(Button);

const styles = StyleSheet.create({
  icon: {
    right: 16,
  },
});
