import API, { fetchApi } from "./api";
import {
  GET_CONTACTS_SUCCESS,
  ADD_CONTACTS_EVENTX,
  ADD_RESET_CONTACTS,
} from "./actionTypes";
import sha256 from "crypto-js/sha256";
import CryptoJS from "crypto-js";

import { Promise } from "bluebird";
import { storeKey } from "./keyStore";
import * as NewRelicRN from "../../../NewRelicRN";
const getContactsSuccess = (payload) => ({
  type: GET_CONTACTS_SUCCESS,
  payload,
});

const getAddContactsEventX = (payload) => ({
  type: ADD_CONTACTS_EVENTX,
  payload,
});

const resetContacts = (payload) => ({
  type: ADD_RESET_CONTACTS,
  payload,
});

const fetchContacts = async (hashedContacts) => {
  const body = {
    hashedPhoneNumbers: hashedContacts,
  };
  const url = `${API.CONTACTS_LOOKUP}`;
  const response = await fetchApi(url, "POST", body);
  return response.data;
};

const getEvtxContacts = (contacts, hash = true) => async (dispatch) => {
  try {
    if (hash) {
      let evtxContacts = [];
      let finalContacts = {
        evtxContacts: evtxContacts,
        unEvtxContacts: contacts,
      };
      dispatch(resetContacts());
      if (contacts) {
        const regex = /[ ()-]/gi;
        let newContacts = contacts;
        try {
          let array = [];
          while (newContacts.length > 0) {
            array.push(newContacts.splice(0, 500));
          }

          newContacts = contacts.slice();
          Promise.map(
            array,
            (arrayContact) => {
              console.log("contact====", arrayContact);
              Promise.all(
                arrayContact
                  .map((c) => c.phoneNumbers)
                  .flat()
                  .map((phone) => {
                    if (phone.number) {
                      return sha256(phone.number.replace(regex, "")).toString(
                        CryptoJS.enc.Hex
                      );
                    } else {
                      return null;
                    }
                  })
              ).then(async (hashedContacts) => {
                fetchContacts(hashedContacts).then((response) => {
                  let newData = response;
                  if (newData && newData.length > 0) {
                    let allContact = [];
                    let evtxContacts = [];

                    for (let i = 0; i < arrayContact.length; ++i) {
                      let contact = arrayContact[i];
                      let number = contact.phoneNumbers
                        ? contact.phoneNumbers.map((s) =>
                            s.number ? s.number.replace(regex, "") : ""
                          )
                        : [];
                      let indexEvent = -1;
                      for (let j = 0; j < newData.length; ++j) {
                        let reg = newData[j];
                        if (number.includes(reg.phoneNumber)) {
                          indexEvent = j;
                          break;
                        }
                      }
                      if (indexEvent != -1) {
                        let reg = newData[indexEvent];
                        let contactNew = { ...contact, id: reg.id };
                        if (reg.firstName) {
                          contactNew = {
                            ...contactNew,
                            givenName: reg.firstName,
                          };
                        }
                        if (reg.lastName) {
                          contactNew = {
                            ...contactNew,
                            familyName: reg.lastName,
                          };
                        }
                        if (
                          reg.profileUrl &&
                          reg.profileUrl.length > 0 &&
                          !reg.profileUrl.includes("dummy-profile-pic.png")
                        )
                          contactNew = {
                            ...contactNew,
                            thumbnailPath: reg.profileUrl + '?' + new Date(),
                          };

                        evtxContacts.push(contactNew);
                      } else {
                        allContact.push(contact);
                      }
                    }

                    let finalContacts = {
                      evtxContacts: evtxContacts,
                      unEvtxContacts: allContact,
                    };
                    dispatch(getAddContactsEventX(finalContacts));
                  } else {
                    let finalContacts = {
                      evtxContacts: [],
                      unEvtxContacts: arrayContact,
                    };
                    dispatch(getAddContactsEventX(finalContacts));
                  }
                });
              });
            },
            { concurrency: array.length }
          );
        } catch (error) {
          finalContacts = {
            evtxContacts: evtxContacts,
            unEvtxContacts: contacts,
          };
          dispatch(getContactsSuccess(finalContacts));
        }
      }
    } else {
      let finalContacts = {
        evtxContacts: contacts.evtxContacts,
        unEvtxContacts: contacts.unEvtxContacts,
      };
      dispatch(getContactsSuccess(finalContacts));
    }
  } catch (error) {
    let finalContacts = {
      evtxContacts: [],
      unEvtxContacts: contacts,
    };
    dispatch(getContactsSuccess(finalContacts));
  }
};

export { getEvtxContacts };
