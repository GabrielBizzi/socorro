import renderer from 'react-test-renderer';
import Button from '../../src/components/button';
import React from 'react';

test('Link test with image hover', () => {
  const component = renderer.create(
    <Button value="Teste" onPress={() => {}} background="#ff9900" />,
  );
  const tree = component.toJSON();
  // console.log(
  //   tree,
  //   'props\n',
  //   tree?.props,
  //   'contentButton\n',
  //   tree.children,
  //   'container\n',
  //   tree.children[0].children,
  //   'Markdown\n',
  //   tree.children[0].children[0].children,
  // );
  expect(tree).toMatchSnapshot();
});
