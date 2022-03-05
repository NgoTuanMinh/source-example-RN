import React from 'react';
import Svg, { Path } from 'react-native-svg';

const Wallets = ({ color }) => {
  return (
    <Svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path d="M2 0C0.89 0 0 0.9 0 2V16C0 17.1 0.89 18 2 18H16C17.1 18 18 17.1 18 16V13.72C18.59 13.37 19 12.74 19 12V6C19 5.26 18.59 4.63 18 4.28V2C18 0.9 17.1 0 16 0H2ZM2 2H16V4H10C8.9 4 8 4.9 8 6V12C8 13.1 8.9 14 10 14H16V16H2V2ZM10 6H17V12H10V6ZM13 7.5C12.172 7.5 11.5 8.172 11.5 9C11.5 9.828 12.172 10.5 13 10.5C13.828 10.5 14.5 9.828 14.5 9C14.5 8.172 13.828 7.5 13 7.5Z" fill={color}/>
    </Svg>
  )
}

export default Wallets;