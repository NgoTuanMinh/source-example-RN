import React, { useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Alert,
  Image,
  ImageBackground,
} from "react-native";
import { Avatar } from "react-native-elements";
import { TextInput } from "react-native-gesture-handler";
import ImagePicker from "react-native-image-crop-picker";
import {
  updateProfileDetails,
  uploadProfilePicture,
} from "../../redux/actions/index";
import AppHeader from "../../components/HeaderComponent";
import defaultAvatar from "../../../assets/images/avatar.png";
import { translate } from "../../../App";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import DatePickerIOS from "./DatePickerIos";
import ModalCountryCode from "./ModalCountryCode";
import { Icon } from "react-native-elements";
import ModalSelectAvatar from "../../components/ModalSelectAvatar";

const PersonalInfo = ({
  profileData,
  uploadProfilePicture,
  updateProfileDetails,
  countries,
}) => {
  const [profile, setProfile] = useState({
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    phoneNumber: profileData.phoneNumber,
    birthday: moment(profileData.birthday).format("MM-DD-YYYY"),
    nationality: { name: "" },
    countryOfResidence: { name: "" },
  });

  const [visibleModalBirthDay, setVisibleModalBirthDay] = useState(false);
  const [visibleCountryCode, setVisibleCountryCode] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  const [avatarTemp, setAvatarTemp] = useState("");
  let datePickerIOS = profile.birthday;

  useEffect(() => {
    const detailContry = countries.filter((item) => {
      if (item.countryCode == profileData.countryOfResidence) return true;
      return false;
    });
    const detailNationalyTy = countries.filter((item) => {
      if (item.countryCode == profileData.nationality) return true;
      return false;
    });
    setProfile({
      ...profile,
      nationality: detailNationalyTy[0],
      countryOfResidence: detailContry[0],
    });
  }, []);

  useEffect(() => {
    return () => {
      setAvatarTemp("");
    };
  }, []);

  const onPressItemNationality = (item) => {
    if (typeModal === "NATIONALITY") {
      setProfile({
        ...profile,
        nationality: item,
      });
    } else if (typeModal === "COUNTRY") {
      setProfile({
        ...profile,
        countryOfResidence: item,
      });
    }
    setVisibleCountryCode(false);
  };

  const onPressNationality = (TYPE) => {
    setVisibleCountryCode(true);
    setTypeModal(TYPE);
  };

  const onChangeFirstname = function(value) {
    setProfile({
      ...profile,
      firstName: value,
    });
  };

  const onChangeLastname = function(value) {
    setProfile({
      ...profile,
      lastName: value,
    });
  };

  const updateProfile = function() {
    if (
      !profile.firstName ||
      profile.firstName.trim().length == 0 ||
      !profile.lastName ||
      profile.lastName.trim().length == 0
    ) {
      showAlert();
      return null;
    }
    const params = {
      ...profile,
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
    };
    updateProfileDetails(params);
  };

  const showAlert = () => {
    Alert.alert(
      "Alert",
      "Please enter data to all fields",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  };

  const changeProfile = () => {
    setIsShowModal(true);
  };

  const onChangeDatePicker = (event, date) => {
    setVisibleModalBirthDay(false);
    if (date) {
      setProfile({
        ...profile,
        birthday: moment(date).format("MM-DD-YYYY"),
      });
    }
  };

  const onChangeDatePickerIOS = (event, date) => {
    datePickerIOS = moment(date).format("MM-DD-YYYY");
  };

  const onDatePickerIOS = (action) => {
    switch (action) {
      case "CLEAR":
        {
          setVisibleModalBirthDay(false);
        }
        break;
      case "DONE":
        {
          setProfile({
            ...profile,
            birthday: datePickerIOS,
          });

          setVisibleModalBirthDay(false);
        }
        break;
      default:
        break;
    }
  };

  const deleteAvatar = () => {};

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
      .catch((error) => {
        console.log("errorUpload: ", error);
      });
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
        console.log("error Upload  : ", error);
      });
  };

  const onCloseModal = () => {
    setIsShowModal(false);
  };

  const getProfilePicture = () => {
    const source =
      profileData.profileUrl &&
      !profileData.profileUrl.includes("dummy-profile-pic.png")
        ? { uri: profileData.profileUrl + "?" + new Date() }
        : defaultAvatar;
    return (
      <Avatar
        rounded
        size={64}
        source={avatarTemp != "" ? { uri: avatarTemp } : source}
        onPress={changeProfile}
      />
    );
  };

  let valueStartDate =
    (profile.birthday && profile.birthday.split("-")) || new Date();

  if (!Array.isArray(valueStartDate)) {
    valueStartDate = new Date();
  } else {
    let date =
      valueStartDate[0] + "/" + valueStartDate[1] + "/" + valueStartDate[2];
    valueStartDate = new Date(date);
  }

  return (
    <AppHeader
      title={translate("PERSONAL_INFORMATION")}
      params={{ isNotification: true, isGoBack: true }}
    >
      <ScrollView
        style={[styles.container, { paddingVertical: 20, flex: 1 }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={[styles.helpContainer, styles.profilePic]}>
          {getProfilePicture()}
          <TouchableOpacity style={{ marginTop: 20 }} onPress={changeProfile}>
            <Text style={styles.changeProfileLabel}>
              {translate("ChangeProfile")}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.box}>
          <View style={styles.viewBottomStyle}>
            <Text style={styles.txtDayStyle}>{translate("Firstname")}</Text>
            <TextInput
              style={styles.inputStyle}
              onChangeText={onChangeFirstname}
              value={profile.firstName}
            />
          </View>
          <View style={styles.viewBottomStyle}>
            <Text style={styles.txtDayStyle}>{translate("Lastname")}</Text>
            <TextInput
              style={styles.inputStyle}
              onChangeText={onChangeLastname}
              value={profile.lastName}
            />
          </View>
          <TouchableOpacity
            onPress={() => setVisibleModalBirthDay(true)}
            style={styles.viewBottomStyle}
          >
            <Text style={styles.txtDayStyle}>{translate("DateOfBirth")}</Text>

            <Text style={styles.inputDayStyle}>{profile.birthday}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onPressNationality("NATIONALITY")}
            style={styles.viewBottomStyle}
          >
            <Text style={styles.txtDayStyle}>{translate("Nationality")}</Text>

            <Text style={styles.inputDayStyle}>{profile.nationality.name}</Text>

            <View style={styles.viewIconStyle}>
              <Icon name="angle-down" type="font-awesome" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onPressNationality("COUNTRY")}
            style={styles.viewBottomStyle}
          >
            <Text style={styles.txtDayStyle}>
              {translate("CountryOfResidence")}
            </Text>
            <Text style={styles.inputDayStyle}>
              {profile.countryOfResidence.name}
            </Text>

            <View style={styles.viewIconStyle}>
              <Icon name="angle-down" type="font-awesome" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity onPress={updateProfile} style={styles.button}>
        <Text style={styles.buttonTitle}>{translate("SaveChanges")}</Text>
      </TouchableOpacity>

      {/* <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 10}
      > */}
      {/* <View style={styles.saveButton}> */}

      {/* </View> */}
      {/* </KeyboardAvoidingView> */}
      {visibleModalBirthDay &&
        (Platform.OS === "ios" ? (
          <DatePickerIOS
            value={valueStartDate}
            datePickerIOS={datePickerIOS}
            onChangeDatePickerIOS={onChangeDatePickerIOS}
            isVisible={visibleModalBirthDay}
            onDatePickerIOS={onDatePickerIOS}
          />
        ) : (
          <DateTimePicker
            value={valueStartDate}
            mode="date"
            display="default"
            onChange={onChangeDatePicker}
            maximumDate={new Date()}
          />
        ))}
      <ModalCountryCode
        data={countries}
        visible={visibleCountryCode}
        setVisibleCountryCode={setVisibleCountryCode}
        onPressItem={onPressItemNationality}
      />
      {isShowModal && (
        <ModalSelectAvatar
          isShowModal={isShowModal}
          onCloseModal={onCloseModal}
          selectImageLibary={selectImageLibary}
          takeImageLibary={takeImageLibary}
          deleteAvatar={deleteAvatar}
        />
      )}
    </AppHeader>
  );
};

PersonalInfo.navigationOptions = {
  title: "Personal Information",
  headerShown: false,
  headerMode: "none",
};

const mapStateToProps = (state) => {
  return {
    countries: state.countryCodes.countries,
    user: state.registration.profile,
    profileData: state.profile.uploadResponse,
  };
};

export default connect(
  mapStateToProps,
  { updateProfileDetails, uploadProfilePicture }
)(PersonalInfo);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "white",
  },
  box: {
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20,
  },
  contentContainer: {
    paddingTop: 0,
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
  },
  icon: {
    marginRight: 15,
    maxWidth: 23,
  },
  inputStyle: {
    height: 40,
    color: "#000000",
    fontSize: 16,
  },
  inputDayStyle: {
    height: 40,
    fontSize: 16,
    color: "#000000",
    paddingTop: 8,
  },
  txtDayStyle: {
    color: "gray",
    fontSize: 14,
  },
  viewIconStyle: {
    position: "absolute",
    right: 10,
    bottom: 10,
    opacity: 0.4,
  },
  viewBottomStyle: {
    marginTop: 25,
    height: 50,
    borderColor: "gray",
    borderBottomWidth: 1,
  },
  saveButton: {
    height: 60,
    marginBottom: 80,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#fff",
  },
  button: {
    position: "absolute",
    bottom: 10,
    backgroundColor: "#EA5284",
    // height: 56,
    paddingVertical: 15,
    width: "90%",
    alignSelf: "center",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  buttonTitle: {
    color: "white",
    fontSize: 20,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  profilePic: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  changeProfileLabel: {
    fontSize: 16,
    color: "#4487C6",
  },
  avatarStyle: {
    height: 64,
    width: 64,
    borderRadius: 32,
    resizeMode: "contain",
  },
});
