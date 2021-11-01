import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useField } from '@unform/core';

import { Container, IconAwesome, TextInput, LabelContainer } from './styles';
import { TextInputProps, TouchableOpacity } from 'react-native';
import Markdown from '../markdown';

interface IInput extends TextInputProps {
  name: string;
  label?: string;
  icon: string;
  onPressIcon?: Function;
}

const Input = (
  { name, label, icon, onPressIcon, ...rest }: IInput,
  ref: any,
) => {
  const { registerField, defaultValue = '', fieldName } = useField(name);
  const inputElementRef = useRef<any>(null);
  const inputValueRef = useRef({ value: defaultValue });

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isFilled, setIsFilled] = useState<boolean>();

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
    clear() {
      resetInputField();
    },
  }));

  const resetInputField = useCallback(() => {
    inputElementRef.current.clear();
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled(!!inputValueRef.current.value);
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(reference: any, value: any) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      },
    });
  }, [fieldName, registerField]);

  return (
    <>
      {label && (
        <LabelContainer>
          <Markdown
            value={label}
            type="subtitle"
            color="rgba(244, 237, 232, 0.7)"
          />
        </LabelContainer>
      )}
      <Container isFocused={isFocused} isErrored={false}>
        {true ? (
          <TouchableOpacity onPress={() => (onPressIcon ? onPressIcon() : {})}>
            <IconAwesome
              name={icon}
              size={20}
              color={isFilled ? '#ff9000' : '#666360'}
            />
          </TouchableOpacity>
        ) : (
          <IconAwesome
            name={icon}
            size={20}
            color={isFilled ? '#ff9000' : '#666360'}
          />
        )}

        <TextInput
          ref={inputElementRef}
          keyboardAppearance="dark"
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onChangeText={(value) => {
            inputValueRef.current.value = value;
          }}
          {...rest}
        />
      </Container>
    </>
  );
};

export default forwardRef(Input);
