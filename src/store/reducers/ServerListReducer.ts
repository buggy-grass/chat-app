import IServerListProps from "../../models/IServerListProps";
import { Reducer } from "redux";
import IActionsProps from "../../models/IActionsProps";
const initialState: IServerListProps = {
    serverList: [],
    activeRoomId: ""
};

// type Action =
//   | { type: "STORE_USER"; payload: IUserProps }
//   | { type: "GET_USER" };

const ServerListReducer: Reducer<IServerListProps, IActionsProps> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "SERVER_LIST_REDUCER/UPDATE":
      return {
        ...state,
        serverList: action.payload.serverList
      };
    case "SERVER_LIST_REDUCER/GET":
      return { ...state };
    default:
      return state;
  }
};

export default ServerListReducer;
