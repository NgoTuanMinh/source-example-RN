import React from 'react';
import Svg, { Path } from 'react-native-svg'

const LogoRegularIcon = ({ color, size }) => {
    const svgSize = size && size.width && size.height ? size : false;
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" width={svgSize ? svgSize.width : '27'} height={svgSize ? svgSize.height : '29'} viewBox="0 0 27 29" fill="none">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M8.35285 16H1.76001C1.20772 16 0.76001 15.5523 0.76001 15V13C0.76001 12.4477 1.20773 12 1.76001 12H8.28034L0.4 0H5.76C6.13333 0 6.4 0.053333 6.56 0.16C6.73333 0.253333 6.88667 0.413334 7.02 0.640001L13.6 11.26C13.6667 11.0867 13.74 10.92 13.82 10.76C13.9 10.5867 13.9933 10.4133 14.1 10.24L20.12 0.740002C20.4133 0.246668 20.7933 0 21.26 0H26.42L17.1 13.82L26.68 28.92H21.3C20.94 28.92 20.6467 28.8267 20.42 28.64C20.2067 28.4533 20.0267 28.24 19.88 28L13.18 16.92C13.1267 17.08 13.0667 17.2333 13 17.38C12.9333 17.5133 12.8667 17.64 12.8 17.76L6.38 28C6.23333 28.2267 6.05333 28.44 5.84 28.64C5.62667 28.8267 5.36 28.92 5.04 28.92H0L8.35285 16Z" fill={color}/>
        </Svg>
    )
}

export default LogoRegularIcon;