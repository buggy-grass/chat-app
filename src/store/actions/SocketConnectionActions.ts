import ISocketConnectionProps from "../../models/ISocketConnectionProps";
import IActionsProps from "../../models/IActionsProps";
import store from "../store";
import i18n from '../../services/localization/i18n';

class SocketConnectionActions {
  static getConnection(): ISocketConnectionProps {
    return store.getState().SocketConnectionReducer;
  }

  static connection(connectionStatus: number) {
    store.dispatch({ type: "SOCKET_CONNECTION/CONNECTION", payload: {connectionStatus} });
  }
}

export default SocketConnectionActions;
