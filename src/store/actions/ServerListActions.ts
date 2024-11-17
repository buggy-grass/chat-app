import IServerListProps from "../../models/IServerListProps";
import IActionsProps from "../../models/IActionsProps";
import store from "../store";
import i18n from '../../services/localization/i18n';

class ServerListActions {
  static getServerList(): IServerListProps {
    return store.getState().ServerListReducer;
  }

  static update(serverList: IServerListProps) {
    store.dispatch({ type: "SERVER_LIST_REDUCER/UPDATE", payload: { serverList } });
  }
}

export default ServerListActions;
