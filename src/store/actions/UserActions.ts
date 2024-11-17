import IUserProps from "../../models/IUserProps";
import IActionsProps from "../../models/IActionsProps";
import store from "../store";
import i18n from "../../services/localization/i18n";

class UserActions {
  static getUser(): IUserProps {
    return store.getState().userReducer;
  }

  static storeUser(user: IUserProps) {
    store.dispatch({ type: "USER_REDUCER/STORE_USER", payload: { username: user.username, nickname: user.nickname } });
  }

  static setLogin(isUserLogin: boolean) {
    store.dispatch({
      type: "USER_REDUCER/SET_LOGIN",
      payload: { isUserLogin: isUserLogin },
    });
  }

  static connectedRoom(connectedRoom: string) {
    store.dispatch({
      type: "USER_REDUCER/CONNECTED_ROOM",
      payload: { connectedRoom },
    });
  }

  static connectedServer(connectedServer: string) {
    store.dispatch({
      type: "USER_REDUCER/CONNECTED_SERVER",
      payload: { connectedServer },
    });
  }

  static changeLanguage(language: string) {
    store.dispatch({
      type: "USER_REDUCER/CHANGE_LANGUAGE",
      payload: { language: language },
    });
  }
}

export default UserActions;
