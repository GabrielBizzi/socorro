import * as React from 'react';
import Svg, {Path, Defs, Pattern, Use, Image} from 'react-native-svg';

function SvgLogo(props) {
  return (
    <Svg
      width="1em"
      height="1em"
      viewBox="0 0 197 53"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}>
      <Path fill="url(#prefix__pattern0)" d="M0 0h197v53H0z" />
      <Defs>
        <Pattern
          id="prefix__pattern0"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}>
          <Use
            xlinkHref="#prefix__image0"
            transform="matrix(.00182 0 0 .00676 0 0)"
          />
        </Pattern>
        <Image
          id="prefix__image0"
          width={550}
          height={148}
          xlinkHref="data:image/png;base64,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"
        />
      </Defs>
    </Svg>
  );
}

export default SvgLogo;
