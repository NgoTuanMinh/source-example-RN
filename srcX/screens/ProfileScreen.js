import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { Avatar } from "react-native-elements";
import AppHeader from "../components/HeaderComponent";
import { Section } from "../components/Layout";
import SwitchComponent from "../components/SwitchComponent";
import { Switch } from "react-native-switch";
import { uploadProfilePicture, setCrewMode } from "../redux/actions/index";
import defaultAvatar from "../../assets/images/avatar.png";
import { translate } from "../../App";
import IcSecuritySvg from "../../assets/images/svg/icSecurity.svg";
import IcWifi from "../../assets/images/svg/icWifi.svg";
import IcHeadphone from "../../assets/images/svg/icHeadphone.svg";
import IcContact from "../../assets/images/svg/icContact.svg";
import IcSetting from "../../assets/images/svg/icSetting.svg";
import * as NewRelicRN from "../../NewRelicRN";
import ModalSelectAvatar from "../components/ModalSelectAvatar";
import { storeKey } from "../redux/actions/keyStore";

const ProfileScreen = ({
  profile,
  uploadProfilePicture,
  navigation,
  user,
  isCrewMode,
  setCrewMode,
}) => {
  profile.isCrew = true;
  const [isShowModal, setIsShowModal] = useState(false);

  const [avatarTemp, setAvatarTemp] = useState("");

  const onCloseModal = () => {
    setIsShowModal(false);
  };

  const changeProfile = () => {
    setIsShowModal(true);
  };

  const selectImageLibary = () => {
    ImagePicker.openPicker({
      width: 200,
      height: 200,
      cropping: true,
      cropperCircleOverlay: true,
    })
      .then((image) => {
        setIsShowModal(false);
        uploadProfilePicture(image);
        setAvatarTemp(image.path);
      })
      .catch((error) => {});
  };

  const takeImageLibary = () => {
    ImagePicker.openCamera({
      width: 200,
      height: 200,
      cropping: true,
      cropperCircleOverlay: true,
    })
      .then((image) => {
        setIsShowModal(false);
        uploadProfilePicture(image);
        setAvatarTemp(image.path);
      })
      .catch((error) => {
        console.log("Upload profile Error====", error);
      });
  };

  const deleteAvatar = () => {};

  useEffect(() => {
    NewRelicRN.nrInteraction("ProfileScreen");
  }, []);

  const getProfilePicture = () => {
    const source =
      profile.profileUrl &&
      !profile.profileUrl.includes("dummy-profile-pic.png")
        ? { uri: profile.profileUrl + "?" + new Date() }
        : defaultAvatar;

    // console.log(avatarTemp, " - ", source);

    return (
      <Avatar
        rounded
        size={64}
        // source={source != "" ? source : { uri: avatarTemp } }
        source={avatarTemp != "" ? { uri: avatarTemp } : source}
        onPress={changeProfile}
      />
    );
  };

  const toggleSwitch = (value) => {
    setCrewMode(value);
    storeKey("@isCrewMode", value);
  };
  const getUserName = () => {
    let customeUser = {
      ...user,
      ...profile,
    };
    if (!customeUser) return "";
    let firstName = "";
    if (customeUser.firstName) {
      firstName = customeUser.firstName;
    }
    let lastName = "";
    if (customeUser.lastName) {
      lastName = customeUser.lastName;
    }
    return firstName + " " + lastName;
  };

  const displayCrewMode = useMemo(() => {
    return (
      <>
        <TouchableOpacity style={styles.listItem}>
          <IcHeadphone width={25} height={25} />
          <Text style={styles.listItemText}>{translate("Crew_Mode")}</Text>
        </TouchableOpacity>

        <Switch
          value={isCrewMode}
          onValueChange={toggleSwitch}
          circleSize={24}
          barHeight={24}
          circleBorderWidth={3}
          backgroundActive={"#48A44A"}
          backgroundInactive={"rgba(0,0,0,0.3)"}
          circleActiveColor={"#fff"}
          circleInActiveColor={"#fff"}
          innerCircleStyle={{
            alignItems: "center",
            justifyContent: "center",
            borderColor: Platform.select({
              ios: isCrewMode ? "transparent" : "rgba(0,0,0,0.3)",
              android: "transparent",
            }),
            padding: 2,
          }}
          switchWidthMultiplier={2}
        />
      </>
    );
  }, [isCrewMode]);

  return (
    <AppHeader
      //title={translate("Profile")}
      //handleClick={() => navigation.navigate('Wallet')}
      params={{ isNotification: true }}
    >
      <ScrollView
        style={[styles.container, { paddingTop: 0 }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View
          style={[
            styles.helpContainer,
            {
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              paddingTop: 25,
            },
          ]}
        >
          {getProfilePicture()}
          <View style={styles.nameContainer}>
            <Text style={{ color: "#000", fontSize: 20, fontWeight: "bold" }}>
              {getUserName()}
            </Text>
            <Text
              style={{
                color: "rgba(0, 0, 0, 0.3 )",
                fontSize: 16,
              }}
            >
              Private beta tester
            </Text>
          </View>
        </View>
        <View style={{ marginBottom: 15, backgroundColor: "#fff" }}>
          <View style={styles.helpContainer}>
            <TouchableOpacity
              onPress={() => {
                setAvatarTemp("");
                navigation.navigate("PersonalInfo");
              }}
              style={[styles.listItem, { marginTop: 15 }]}
            >
              {/* <CircleIcons
                name="settings"
                color="#4487C6"
                iconContainerStyles={styles.icon}
              ></CircleIcons> */}
              <IcSetting width={25} height={25} />

              <Text style={styles.listItemText}>
                {translate("PersonalInfo")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("SecurityScreen")}
              style={styles.listItem}
            >
              <IcSecuritySvg width={25} height={25} />
              <Text style={styles.listItemText}>{translate("Security")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Wearables")}
              style={styles.listItem}
            >
              <IcWifi width={25} height={25} />
              <Text style={styles.listItemText}>{translate("Wearables")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Contacts")}
              style={styles.listItem}
            >
              <IcContact width={25} height={25} />
              <Text style={styles.listItemText}>{translate("Contacts")}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Section title="Settings">
          <View style={styles.helpContainer}>
            {/* <TouchableOpacity
              onPress={() => navigation.navigate('ThemeScreen')}
              style={styles.listItem}
            >
              <CircleIcons
                name="settings"
                iconContainerStyles={styles.icon}
                color="#FCB96A"
              ></CircleIcons>
              <Text style={styles.listItemText}>Themes</Text>
            </TouchableOpacity> */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {profile.isStaff && displayCrewMode}
            </View>
            <SwitchComponent />
          </View>
        </Section>
        {isShowModal && (
          <ModalSelectAvatar
            isShowModal={isShowModal}
            onCloseModal={onCloseModal}
            selectImageLibary={selectImageLibary}
            takeImageLibary={takeImageLibary}
            deleteAvatar={deleteAvatar}
          />
        )}
      </ScrollView>
    </AppHeader>
  );
};

const IconCustom = ({ source, size }) => {
  return (
    <Image
      source={source}
      style={{ width: size, height: size, resizeMode: "contain" }}
    />
  );
};

const ButtonIconNavigate = ({ source, size, onPress, label }) => {
  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={onPress}
      style={styles.listItem}
    >
      <IconCustom source={source} size={size} />
      <Text style={[styles.listItemText, { marginLeft: 15 }]}>{label}</Text>
    </TouchableOpacity>
  );
};

ProfileScreen.navigationOptions = {
  headerShown: false,
  headerMode: "none",
};

const mapStateToProps = (state) => {
  return {
    user: state.registration.screenName,
    profile: state.profile.uploadResponse,
    isCrewMode: state.profile.isCrewMode,
  };
};

export default connect(
  mapStateToProps,
  { uploadProfilePicture, setCrewMode }
)(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    //backgroundColor: '#fff'
    backgroundColor: "#f2f2f2",
  },
  contentContainer: {
    paddingBottom: 100,
  },
  helpContainer: {
    paddingRight: 15,
    paddingLeft: 15,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  listItemText: {
    fontSize: 16,
    marginLeft: 15,
  },
  nameContainer: {
    marginLeft: 15,
  },
  btnNotify: {
    alignSelf: "flex-end",
    paddingRight: 15,
  },
  iconStyle: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  numberContainer: {
    position: "absolute",
    right: 12,
    top: 0,
    width: 15,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textNumberNotify: {
    color: "white",
    fontWeight: "bold",
    fontSize: 8,
  },
  icon: {
    marginRight: 15,
    maxWidth: 24,
    width: 24,
    height: 24,
  },
  profile: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  subtitle: {
    color: "rgba(0, 0, 0, 0.3 )",
    fontSize: 16,
  },
  avatarStyle: {
    resizeMode: "cover",
    backgroundColor: "transparent",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
