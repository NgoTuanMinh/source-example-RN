import React from 'react';
import Svg, { Path, G, Defs } from 'react-native-svg';

const ShapeTab = ({ color }) => {
  return (
    <Svg
      width="375"
      height="90"
      viewBox="0 0 375 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G filter="url(#filter0_d)">
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0 24L133.071 24C145.182 24 155.17 33.2594 162.288 43.058C167.366 50.0485 175.312 56.2844 187.5 56.2844C200.288 56.2844 208.724 49.4198 214.103 42.0214C220.979 32.565 230.806 24 242.498 24L375 24V90H0L0 24Z"
          fill="white"
        />
      </G>
      <Defs>
        <filter
          id="filter0_d"
          x="-20"
          y="0"
          width="415"
          height="106"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="-4" />
          <feGaussianBlur stdDeviation="10" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
      </Defs>
    </Svg>
  );
};

export default ShapeTab;
