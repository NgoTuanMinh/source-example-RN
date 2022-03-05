
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Avatar } from 'react-native-elements';
import { getProfileDetails } from '../../../redux/actions/index';
import defaultAvatar from "../../../../assets/images/avatar.png";

const ProfileTab = ({ getProfileDetails, profile }) => {
  useEffect(() => {
    getProfileDetails();
  }, []);

  const getProfilePicture = () => {
    const source = profile.profileUrl && !profile.profileUrl.includes("dummy-profile-pic.png") ? { uri: profile.profileUrl + '?' + new Date() } : defaultAvatar;
    return <Avatar rounded size={24} source={source} />
  }

  return (
    <>
      {
        getProfilePicture()
      }
    </>)
}

const mapStateToProps = state => {
  return {
    profile: state.profile.uploadResponse
  };
};

export default connect(mapStateToProps, { getProfileDetails })(ProfileTab);