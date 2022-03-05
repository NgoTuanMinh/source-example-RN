import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
import LinearGradient from 'react-native-linear-gradient';

const RegistrationStatusBar = ({ step, stepsCounter }) => {
  const width = `${(step * 100) / stepsCounter}%`;
  return (
    <View style={[styles.linearGradient, (style = { width })]}>
      <LinearGradient colors={['#C2426C', '#FF6195']}>
        <View style={[width, { height: 4 }]} />
      </LinearGradient>
    </View>
  );
};

const mapStateToProps = state => ({
  stepsCounter: state.registration.stepsCounter
});

export default connect(
  mapStateToProps,
  () => ({})
)(RegistrationStatusBar);

const styles = StyleSheet.create({
  linearGradient: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    overflow: 'hidden',
    position: 'absolute',
    flex: 1,
    top: 0,
    left: 0,
    alignSelf: 'flex-start',
    height: 4
  }
});
