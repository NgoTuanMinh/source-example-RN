import React from 'react';
import Svg, { Path } from 'react-native-svg';

const RefoundIcon = ({ color }) => {
    return (
        <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M7 5H11C12.105 5 13 5.895 13 7V9C13 9.837 12.486 10.553 11.756 10.852L13 15H11L9.8 11H9V15H7V5ZM9 7V9H11V7H9ZM10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0ZM10 1.997C5.582 1.996 2 5.577 2 9.995C2 14.413 5.582 17.996 10 17.997C14.418 17.999 18 14.418 18 10C18 5.582 14.418 1.999 10 1.997Z" fill={color}/>
        </Svg>
    )
};

export default RefoundIcon;