import { combineReducers } from "redux";

import UserAuth from "./User/Authentication";
import registration from "./Registration";
import countryCodes from "./countryCodes";
import wallets from "./Wallets";
import NotifReducer from "./Notifications/index";
import tokens from "./tokens";
import appInterface from "./appInterface";
import transactions from "./transactions";
import profile from "./Profile";
import notifications from "./Notifications";
import recoverAccount from "./recoverAccount";
import security from "./security";
import nationalities from "./nationalities";
import events from "./events";
import showToast from "./showToast/showToastReducer";

export default combineReducers({
  UserAuth,
  registration,
  countryCodes,
  wallets,
  NotifReducer,
  tokens,
  appInterface,
  transactions,
  profile,
  notifications,
  recoverAccount,
  security,
  nationalities,
  events,
  showToast,
});
