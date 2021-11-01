import Markdown from '../markdown';
import React, {memo} from 'react';
import Logo from 'assets/Logo';

import {VERSION} from '@env';
import {TopContainer, LogoContainer} from './styles';

interface ILogoAndVersion {
  withoutVersion?: boolean;
}

const LogoAndVersion = ({withoutVersion}: ILogoAndVersion) => {
  const version = VERSION.split('.');
  return (
    <TopContainer>
      <LogoContainer>
        <Logo width={200} height={60} />
      </LogoContainer>
      {!withoutVersion ? (
        <>
          <Markdown value="Armazenagem" type="subtitle" fontWeight={700} />
          <Markdown
            value={`V${version[0]}.${version[1]}`}
            color="#999591"
            style={{fontSize: 12, paddingTop: 4}}
            fontWeight={500}
          />
        </>
      ) : (
        <Markdown value="WMS" fontWeight={700} style={{fontSize: 18}} />
      )}
    </TopContainer>
  );
};

export default memo(LogoAndVersion);
