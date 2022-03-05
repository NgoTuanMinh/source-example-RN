import { Platform } from "react-native";
import { getStatusBarHeight } from "../components/Constants/Constants";

const theme = {
  container: {
    width: "100%",
    padding: 15,
    //justifyContent: 'center',
    alignItems: "center",
    flexDirection: "column",
    flex: 1,
    // backgroundColor: "#E5E5E5",
  },
  boldText: {
    fontWeight: "bold",
    fontFamily: "Lato-bold",
  },
  droidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? getStatusBarHeight() : 0,
  },
  Button: {
    titleStyle: {
      color: "#000",
      fontSize: 16,
      textTransform: "uppercase",
      fontWeight: "bold",
      fontFamily: "Lato-bold",
    },
    buttonStyle: {
      borderRadius: 4,
      width: "100%",
      padding: 15,
    },
    containerStyle: {
      backgroundColor: "#fff",
      width: "100%",
    },
  },
  Text: {
    style: {
      fontSize: 16,
      fontFamily: "Lato-bold",
      marginTop: 20,
    },
    h1Style: {
      fontSize: 24,
      fontWeight: "bold",
      fontFamily: "Lato-bold",
      textTransform: "uppercase",
    },
  },
};

export default theme;
