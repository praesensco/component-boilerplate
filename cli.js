#!/usr/bin/env node

const fs = require('fs');
const arg = require('arg');

const args = arg({
  '--name':  String,
  '--path': String,
});

const PATH = args['--path'];
const NAME = args['--name'];

const FILES = [
  {
    name: '{{ name }}.tsx',
    content: `import {
  Wrapper,
} from './element';

interface {{ name }}Props {

}

export const {{ name }} = (props: {{ name }}Props): JSX.Element => {
  return (
    <Wrapper>
      Hello {{ name }}
    </Wrapper>
  );
};

export default {{ name }};
`,
  },
  {
    name: 'element.tsx',
    content: `import styled from 'styled-components';
import { styles } from 'shared/constant/style';

export const Wrapper = styled.div\`\`;
`,
  },
  {
    name: '{{ name }}.stories.tsx',
    content: `import { storiesOf } from '@storybook/react';

import {{ name }} from './{{ name }}';
import fixture from './__fixtures__';

storiesOf('{{ name }}', module)
.add('default', () => (
  <{{ name }}
    {..fixture}
  />
));
`,
  },
  {
    name: '__fixtures__/index.ts',
    content: `export default {
  componentName: '{{ name }}',
}
`,
  },
  {
    name: 'index.ts',
    content: `export { default } from './{{ name }}';
`
  },
];

const run = () => {
  if (!NAME) {
    console.error('Please specify the --name argument');
    return;
  }

  if (!fs.existsSync(NAME)) {
    fs.mkdirSync(NAME);
  }

  if (!fs.existsSync(`${NAME}/__fixtures__`)) {
    fs.mkdirSync(`${NAME}/__fixtures__`);
  }

  FILES.map((file) => {
    fs.writeFile(
      `./${NAME}/${file.name.replace('{{ name }}', NAME)}`,
      file.content.replace(/\{\{ name \}\}/g, NAME),
      (err) => {
        if (err) return console.log(err);
        console.log(`Written ${NAME}/${file.name.replace('{{ name }}', NAME)}`);
      },
    );
  });
};

run();
