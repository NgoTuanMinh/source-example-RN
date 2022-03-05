import React, { useState } from "react";
import { connect } from "react-redux";
import {
  View,
  TextInput,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import RegistrationStatusBar from "../../components/RegistrationStatusBar";
import { Button, ThemeProvider, Text } from "react-native-elements";
import theme from "../../styles/themeStyles";
import LinearGradient from "react-native-linear-gradient";
import { saveScreenName } from "../../redux/actions/index";
import { translate } from "../../../App";

const SetNameScreen = ({ saveScreenName }) => {
  const [name, setName] = useState("");
  let data = {
    ...navigation.state.params,
    name: name,
  };

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={theme.droidSafeArea}>
        <View style={theme.container}>
          <RegistrationStatusBar step={3} />
          <KeyboardAvoidingView
            style={styles.form}
            behavior={Platform.OS == "ios" && "padding"}
            keyboardVerticalOffset={Platform.OS === "ios" && 70}
          >
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Text h1>{translate("SetScreenName")}</Text>
              <Text style={{ opacity: 0.4 }}>{translate("GoWild")}</Text>
              <View
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  paddingTop: 30,
                }}
              >
                <TextInput
                  style={[styles.input, { height: 60, textAlign: "center" }]}
                  onChangeText={(text) => setName(text)}
                  autoFocus={true}
                />
              </View>
            </View>
            <Button
              ViewComponent={LinearGradient}
              linearGradientProps={{
                colors: ["#FF6195", "#C2426C"],
                start: { x: 0, y: 0.5 },
                end: { x: 1, y: 0.5 },
              }}
              title={translate("Continue")}
              titleStyle={{ color: "#fff" }}
              onPress={() => {
                saveScreenName(data);
              }}
            />
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </ThemeProvider>
  );
};

export default connect(
  null,
  { saveScreenName }
)(SetNameScreen);

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.2)",
    fontSize: 24,
    width: "100%",
    color: "#000",
  },
  form: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "column",
    width: "100%",
    paddingTop: 40,
  },
});
