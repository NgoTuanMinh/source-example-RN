import React from 'react';
import Svg, { Path } from 'react-native-svg';

const SplitSVG = ({ color }) => {
  return (
    <Svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M13.6654 0.332031L16.7187 3.38536L12.8787 7.2267L14.772 9.12136L18.6134 5.28003L21.6667 8.33336V0.332031H13.6654ZM8.33336 0.332031H0.332031V8.33336L3.38536 5.28003L9.6667 11.5494V21.6667H12.3294V10.4547L5.28003 3.3867"
        fill={color}
      />
    </Svg>
  );
};

export default SplitSVG;
