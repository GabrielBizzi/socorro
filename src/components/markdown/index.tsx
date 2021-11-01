import React, {memo} from 'react';
import {TextProps} from 'react-native';

import {MarkdownText} from './styles';

interface IMarkdown extends TextProps {
  value: string;
  fontWeight?: 400 | 500 | 700;
  type?: 'title' | 'subtitle';
  color?: string;
  align?: string;
}

const Markdown = ({
  value,
  fontWeight,
  align,
  type,
  color,
  ...rest
}: IMarkdown) => {
  return (
    <MarkdownText
      type={type}
      align={align}
      color={color}
      fontWeight={fontWeight}
      {...rest}>
      {value}
    </MarkdownText>
  );
};

export default memo(Markdown);
