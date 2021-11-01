import React, {memo, useRef} from 'react';
import {Container, Content, ContentTitle, PickerComponent} from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {Markdown} from 'components/markdown';
interface IPicker {
  defaults?: string;
  onValueChange?: Function;
}

interface IResponseSubsidiary {
  subsidiaryCode: string;
  description: string;
  subsidiaryType: number;
  code: number;
  useIns: number;
  datIns: string;
}

const Picker = ({defaults, onValueChange}: IPicker) => {
  const refPicker = useRef(null);
  const items = ['Palete', 'Caixa', 'Produto'];

  return (
    <Container>
      <ContentTitle>
        <Markdown
          value="Tipo:"
          type="subtitle"
          color="rgba(244, 237, 232, 0.7)"
          fontWeight={500}
        />
      </ContentTitle>
      <Content>
        <Icon name="list" size={25} color="#666360" />
        <PickerComponent
          ref={refPicker}
          selectedValue={defaults}
          dropdownIconColor="#999591"
          onValueChange={onValueChange}>
          {items?.map((sub) => (
            <PickerComponent.Item label={sub} value={sub} />
          ))}
        </PickerComponent>
      </Content>
    </Container>
  );
};

export default memo(Picker);
