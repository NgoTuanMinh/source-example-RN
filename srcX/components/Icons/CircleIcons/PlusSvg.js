import React from "react";
import Svg, { Path } from "react-native-svg";

const PlusIcon = ({ color }) => {
  return (
    <Svg
      width="14"
      height="14"
      viewBox="0 0 14 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M14 8.99805H8V14.998H6V8.99805H0V6.99805H6V0.998047H8V6.99805H14V8.99805Z"
        fill={color}
      />
    </Svg>
  );
};

export default PlusIcon;
