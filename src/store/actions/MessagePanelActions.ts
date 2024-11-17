import IMessagePanelProps from "../../models/IMessagePanelProps";
import IActionsProps from "../../models/IActionsProps";
import store from "../store";
import i18n from '../../services/localization/i18n';

class UserActions {
  static getUser(): IMessagePanelProps {
    return store.getState().MessagePanelReducer;
  }

  static open(options: IMessagePanelProps) {
    store.dispatch({ type: "MESSAGE_PANEL_REDUCER/OPEN", payload: {show: options.show, header: options.header, messages: options.messages } });
  }
}

export default UserActions;
