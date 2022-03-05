import React from 'react';
import Svg, { Path } from 'react-native-svg'

const InviteCrewSVG = ({ color }) => {
    return (
        <Svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M0.0099771 18L21 9L0.0099771 0L-2.28882e-05 7L15 9L-2.28882e-05 11L0.0099771 18Z" fill={color}/>
        </Svg>
    )
}

export default InviteCrewSVG;