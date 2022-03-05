import React from 'react';
import { ActivityIndicator, StatusBar, View, ImageBackground, StyleSheet } from 'react-native';
import { getDataKeystore } from './../redux/actions/keyStore';
import Logo from '../components/Icons/Svg/Start-logo';

class AuthLoadingScreen extends React.Component {
    componentDidMount() {
        this._bootstrapAsync();
    }
    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        // this.props.navigation.navigate('Auth');
        // return;
        
        const publicKey = await getDataKeystore("@publicKey");
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        setTimeout(() => {
            this.props.navigation.navigate(publicKey ? 'AppStack' : 'Auth');
        }, 1000)
    };

    // Render any loading content that you like here
    render() {
        return (
            <ImageBackground
                source={require('../../assets/images/background.png')}
                style={styles.backgroundImg}
            >
                <View style={styles.logo}>
                    <Logo width={83} height={110} />
                </View>
                <View style={styles.wrapper}>
                    <ActivityIndicator size="large" color="#ffffff" />
                    <StatusBar barStyle="default" />
                </View>
            </ImageBackground>
        );
    }
}

export default AuthLoadingScreen;


const styles = StyleSheet.create({
    backgroundImg: {
        width: '100%',
        height: '100%'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        top: 200
    },
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    }
});