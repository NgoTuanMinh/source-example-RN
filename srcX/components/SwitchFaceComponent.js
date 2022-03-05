import React from 'react';
import { Switch } from 'react-native-switch';

const SwitchFaceComponent = ({ faceId, handleSwitch }) => {
    return (

        <Switch
            value={faceId}
            onValueChange={handleSwitch}
            circleSize={24}
            barHeight={24}
            circleBorderWidth={3}
            backgroundActive={'#48A44A'}
            backgroundInactive={'rgba(0,0,0,0.3)'}
            circleActiveColor={'#fff'}
            circleInActiveColor={'#fff'}
            innerCircleStyle={{
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: Platform.select({
                    ios: faceId ? 'transparent' : 'rgba(0,0,0,0.3)',
                    android: 'transparent'
                }),
                padding: 2
            }}
            switchWidthMultiplier={2}
        />
    );
}

export default SwitchFaceComponent;