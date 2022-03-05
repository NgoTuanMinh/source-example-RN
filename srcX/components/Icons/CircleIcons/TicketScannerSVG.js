import React from 'react';
import Svg, { Path } from 'react-native-svg'

const TicketScannerSVG = ({ color }) => {
    return (
        <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M0 11V9H20V11H0ZM14 20V18H18V14H20V18C20 19.1046 19.186 20 18.1818 20H14ZM6 20H1.81818C0.814028 20 0 19.1046 0 18V14H2V18H6V20ZM14 0H18.1818C19.186 0 20 0.89543 20 2V6H18V2H14V0ZM6 0V2H2V6H0V2C0 0.89543 0.814028 0 1.81818 0H6Z" fill={color}/>
        </Svg>
    )
}

export default TicketScannerSVG;