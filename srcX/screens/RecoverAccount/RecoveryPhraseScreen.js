import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  Dimensions,
  StatusBar,
} from "react-native";
import { bindActionCreators } from "redux";
import {
  ButtonLinear,
  HeaderCustomComponent,
} from "../Secutity/SecurityScreen";
import { translate } from "../../../App";
import { AESDecrypt, AESEncrypt } from "../../utils/EncryptSecretKey";
import { makeSha512 } from "../../halpers/utilities";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

function RecoveryPhraseScreen(props) {
  const { navigation, recoverAccount } = props;

  const [valueInput, setValueInput] = useState("");
  const [isShowWrongCode, setIsShowWrongCode] = useState(false);

  const _handleSubmit = async () => {
    try {
      //let password = "reunion unfair almost hawk grain economy chalk regular ten goddess belt profit"
      let password = valueInput;
      const array = valueInput.trim().split(" ");
      if (array && array.length < 12) {
        setIsShowWrongCode(true);
        return;
      }
      let recoveryHashKey =
        recoverAccount.accountRecoveryNonPublicKey.recoveryHashKey;
      if (recoveryHashKey !== makeSha512(password)) {
        setIsShowWrongCode(true);
        return;
      }
      let params = { passwordMemonic: password };
      navigation.navigate("NewPassCode", params);
    } catch (error) {
      setIsShowWrongCode(true);
    }
  };

  const onChangeInput = (txt) => {
    setValueInput(txt);
    //   if(!isShowWrongCode) setIsShowWrongCode(false);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <HeaderCustomComponent
            title={"RECOVER ACCOUNT"}
            onPress={() => navigation.goBack()}
          />

          <KeyboardAvoidingView
            style={styles.form}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 10}
          >
            <View style={{ flex: 1 }}>
              <View
                style={{ flex: 1, alignItems: "center", paddingHorizontal: 15 }}
              >
                <Text style={styles.textBody}>{"ENTER RECOVERY PHRASE"}</Text>

                <Text style={styles.textNote}>
                  {`Enter the 12-word recovery phrase you were given when you created your wallet.`}
                </Text>

                <View style={{ marginTop: 20 }}>
                  <TextInput
                    value={valueInput}
                    style={styles.inputContainer}
                    underlineColorAndroid="transparent"
                    onChangeText={(text) => onChangeInput(text)}
                    multiline={true}
                    placeholder="Recovery phrase"
                    placeholderTextColor="rgba(0,0,0,0.3)"
                    autoFocus
                  />
                </View>

                {isShowWrongCode && (
                  <View>
                    <Text
                      style={{ color: "red", marginTop: 10, width: width - 30 }}
                    >
                      Invalid recovery phrase. Please double check if it's
                      filled in correctly{" "}
                    </Text>
                  </View>
                )}
              </View>

              <ButtonLinear
                //checkDisableButton={checkDisableButton()}
                onPress={() => _handleSubmit()}
                label="SUBMIT"
                style={[styles.buttonSubmit]}
                textStyle={styles.textBtnSubmit}
              />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bodyContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 15,
  },
  textBody: {
    fontWeight: "bold",
    fontSize: 24,
    fontFamily: "Lato",
  },
  textNote: {
    marginTop: 15,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 25,
    opacity: 0.4,
    fontFamily: "Lato",
  },
  buttonSubmit: {
    paddingVertical: 15,
    borderRadius: 4,
    alignItems: "center",
    marginHorizontal: 15,
    width: width - 30,
  },
  textBtnSubmit: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Lato",
  },
  inputContainer: {
    borderBottomWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.2)",
    fontSize: 16,
    width: width - 30,
    minHeight: 40,
    color: "#000",
    marginBottom: 5,
    paddingBottom: 10,
  },
  form: {
    flex: 1,
    // justifyContent: 'space-between',
    marginTop: "10%",
  },
});

const mapStateToProps = (state) => {
  return {
    recoverAccount: state.recoverAccount,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecoveryPhraseScreen);
