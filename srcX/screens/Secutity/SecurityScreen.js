import React from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
} from "react-native";
import * as Images from "../../components/Icons/CircleIcons";
import LinearGradient from "react-native-linear-gradient";
import { bindActionCreators } from "redux";
import NavigationService from "../../../src/NavigationService";

function SecurityScreen(props) {
  const { navigation, user } = props;
  const phoneNumber = user.phoneNumber
    ? user.phoneNumber.slice(0, 3) + " " + user.phoneNumber.slice(3)
    : null;
  const email = user.email ? user.email : null;
  const isVerify = user.emailVerified;
  const navVerifyPhoneNumber = () => {
    const params = {
      isVerifyPhoneNumber: true,
    };
    navigation.navigate("VerifyPhoneNumber", params);
  };

  const navVerifyEmail = () => {
    const params = {
      isVerifyEmail: true,
    };
    navigation.navigate("VerifyPhoneNumber", params);
  };

  const nextBackupWallet = () => {
    navigation.navigate("BackupWalletScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderCustomComponent
        title={"SECURITY"}
        onPress={() => NavigationService.goBack()}
      />

      <Section style={[styles.flexRow, { marginTop: 25 }]}>
        <Image source={Images.icPhone} style={styles.icPhone} />

        <View style={[styles.flexRow, styles.marginLeft, { flex: 1 }]}>
          <Text>{phoneNumber}</Text>

          <Image
            source={Images.icSuccess}
            style={[
              styles.icBack,
              styles.marginLeft,
              { width: 12, height: 12 },
            ]}
          />
        </View>

        <TouchableOpacity onPress={navVerifyPhoneNumber}>
          <Image source={Images.icGrayPen} style={styles.icBack} />
        </TouchableOpacity>
      </Section>

      <Section style={{ marginTop: 5 }}>
        <View style={styles.flexRow}>
          <Image source={Images.icMail} style={styles.icPhone} />

          <View
            style={[
              styles.flexRow,
              styles.marginLeft,
              { flex: 1, marginRight: 40 },
            ]}
          >
            {email ? (
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={{ lineHeight: 40 }}
              >
                {email}
              </Text>
            ) : (
              <Text onPress={navVerifyEmail} style={styles.btnEnterEmail}>
                Enter your email address
              </Text>
            )}

            {email ? (
              isVerify ? (
                <Image
                  source={Images.icSuccess}
                  style={[
                    styles.icBack,
                    styles.marginLeft,
                    { width: 12, height: 12 },
                  ]}
                />
              ) : (
                <Image
                  source={Images.icWarning}
                  style={[
                    styles.icBack,
                    styles.marginLeft,
                    { width: 12, height: 12 },
                  ]}
                />
              )
            ) : null}
          </View>

          {email && (
            <TouchableOpacity onPress={navVerifyEmail}>
              <Image source={Images.icGrayPen} style={styles.icBack} />
            </TouchableOpacity>
          )}
        </View>

        {!isVerify && (
          <Text style={styles.textNote}>
            Enter and verify an email to help you recover your account if you
            forget your password, lose your phone or phone number
          </Text>
        )}

        {!isVerify && (
          <ButtonLinear
            label="VERIFY NOW"
            style={styles.buttonVerify}
            textStyle={styles.textVerify}
            onPress={navVerifyEmail}
          />
        )}
      </Section>
    </SafeAreaView>
  );
}

export const HeaderCustomComponent = ({ title, onPress }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onPress} style={styles.btnBack}>
        <Image source={Images.icBack} style={styles.icBack} />
      </TouchableOpacity>
      {title && <Text style={styles.textTitleHeader}>{title}</Text>}
    </View>
  );
};

const Section = ({ children, style }) => {
  return <View style={[styles.section, style]}>{children}</View>;
};

export const ButtonLinear = ({
  label,
  style,
  onPress,
  textStyle,
  checkDisableButton,
}) => {
  return (
    <TouchableOpacity disabled={checkDisableButton} onPress={() => onPress()}>
      <LinearGradient
        colors={["#FF6195", "#C2426C"]}
        style={style}
        useAngle={true}
        angle={90}
      >
        <Text style={textStyle}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  icBack: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  btnBack: {
    position: "absolute",
    zIndex: 1,
    padding: 15,
  },
  textTitleHeader: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  headerContainer: {
    paddingVertical: 15,
    justifyContent: "center",
  },
  section: {
    paddingBottom: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "gray",
    marginHorizontal: 15,
  },
  icPhone: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  marginLeft: {
    marginLeft: 5,
  },
  textNote: {
    color: "gray",
    lineHeight: 22,
  },
  textVerify: {
    color: "white",
    fontWeight: "bold",
  },
  buttonVerify: {
    paddingVertical: 8,
    marginTop: 15,
    borderRadius: 4,
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 30,
  },
  btnEnterEmail: {
    opacity: 0.2,
    width: "100%",
    paddingVertical: 10,
    fontSize: 16,
    marginLeft: 5,
  },
});

const mapStateToProps = (state) => {
  return {
    user: { ...state.registration.profile, ...state.registration.screenName },
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SecurityScreen);
