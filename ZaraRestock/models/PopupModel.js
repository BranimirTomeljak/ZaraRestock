import { Popup } from "popup-ui";

//Warning
export function warningPopup(text) {
  Popup.show({
    type: "Warning",
    title: "Warning",
    button: true,
    textBody: text,
    buttontext: "Ok",
    callback: () => Popup.hide(),
  });
}

//Danger
export function dangerPopup(text) {
  Popup.show({
    type: "Danger",
    title: "Error",
    button: true,
    textBody: text,
    buttontext: "Ok",
    callback: () => Popup.hide(),
  });
}

//Success
export function successPopup(text) {
  Popup.show({
    type: "Success",
    title: "Success",
    button: true,
    textBody: text,
    buttontext: "Ok",
    callback: () => Popup.hide(),
  });
}
export function successPopupNavigation(text, navigation, goToScreen) {
  Popup.show({
    type: "Success",
    title: "Success",
    button: true,
    textBody: text,
    buttontext: "Ok",
    callback: () => {
      Popup.hide();
      navigation.navigate(goToScreen);
    },
  });
}
